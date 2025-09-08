// src/pages/CommunityPage.js
import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Plus,
  Tag,
  Trash2,
  Bookmark,
  BookmarkCheck,
  Share2,
  Search,
  X,
  User,
} from "lucide-react";

/* --- constants / storage helpers --------------------------------------- */
const NICKS = [
  "Shinchan","Doraemon","Nobita","Shizuka","Pikachu","Totoro","Chhota Bheem",
  "Motu","Patlu","Goku","Naruto","Luffy","Baymax","Pooh","Tweety","Scooby",
  "Jerry","Tom","Donald","Goofy"
];

const ALIAS_KEY    = "mm.community.aliases";
const POSTS_KEY    = "mm.community.posts";
const SAVED_KEY    = "mm.community.saved";
const DRAFT_KEY    = "mm.community.draft";
const COMMENTS_KEY = "mm.community.comments"; // { [postId]: [{id,text,author,createdAt}] }

const ALL_FLAIRS = ["Guided meditation","Vent-box","Professionals","General"];

const loadJson = (k, fallback) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? fallback; } catch { return fallback; } };
const saveJson = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

/* --- ui helpers --------------------------------------------------------- */
const avatarUrl = (name) =>
  `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${encodeURIComponent(
    name || "guest"
  )}&backgroundType=gradientLinear&radius=50`;

const timeAgo = (ts) => {
  const diff = Math.max(0, Date.now() - ts);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

// pastel chips like the Profile vibe
const flairClass = (flair) => {
  const base = "text-xs px-2 py-1 rounded-full border border-rose-100 shadow-sm";
  const map = {
    "Guided meditation": "bg-gradient-to-r from-pink-50 via-rose-50 to-orange-50 text-rose-700",
    "Vent-box":          "bg-gradient-to-r from-rose-50 via-pink-50 to-orange-50 text-rose-700",
    Professionals:       "bg-gradient-to-r from-orange-50 via-yellow-50 to-rose-50 text-amber-700",
    General:             "bg-gradient-to-r from-yellow-50 via-orange-50 to-pink-50 text-amber-700",
  };
  return `${base} ${map[flair] || map.General}`;
};

/* --- component ---------------------------------------------------------- */
export default function CommunityPage() {
  /* aliases */
  const [aliases, setAliases] = useState(() => loadJson(ALIAS_KEY, {}));
  const aliasFor = (name) => {
    if (aliases[name]) return aliases[name];
    const used = new Set(Object.values(aliases));
    const pool = NICKS.filter((n) => !used.has(n));
    const alias = pool.length ? pool[Math.floor(Math.random() * pool.length)]
                              : `Anon-${Math.random().toString(36).slice(2,6)}`;
    const next = { ...aliases, [name]: alias };
    setAliases(next);
    saveJson(ALIAS_KEY, next);
    return alias;
  };

  /* posts */
  const [posts, setPosts] = useState(() => {
    const saved = loadJson(POSTS_KEY, null);
    if (Array.isArray(saved) && saved.length) return saved;
    return [
      {
        id: 1,
        author: "Sam",
        flair: "Guided meditation",
        title: "What’s your go-to 5-minute breathing routine?",
        body: "Share a quick breathing exercise that helps you re-center.",
        votes: 24,
        comments: 2, // initial seed, real count comes from commentsMap
        createdAt: Date.now() - 1000 * 60 * 60 * 3,
      },
      {
        id: 2,
        author: "Aarav",
        flair: "Vent-box",
        title: "Feeling overwhelmed with exams",
        body: "Any tips to manage study anxiety without burning out?",
        votes: 11,
        comments: 1,
        createdAt: Date.now() - 1000 * 60 * 60 * 8,
      },
    ];
  });
  useEffect(() => { saveJson(POSTS_KEY, posts); }, [posts]);

  /* saved */
  const [saved, setSaved] = useState(() => new Set(loadJson(SAVED_KEY, [])));
  useEffect(() => { saveJson(SAVED_KEY, Array.from(saved)); }, [saved]);

  /* comments */
  const [commentsMap, setCommentsMap] = useState(() => loadJson(COMMENTS_KEY, {}));
  useEffect(() => { saveJson(COMMENTS_KEY, commentsMap); }, [commentsMap]);
  const getComments = (postId) => commentsMap[postId] || [];
  const setComments = (postId, nextArr) =>
    setCommentsMap((m) => ({ ...m, [postId]: nextArr }));

  /* composer + draft */
  const [composerOpen, setComposerOpen] = useState(false);
  const [newPost, setNewPost] = useState(() =>
    loadJson(DRAFT_KEY, { title: "", body: "", flair: "General" })
  );
  useEffect(() => { saveJson(DRAFT_KEY, newPost); }, [newPost]);
  const clearDraft = () => {
    const blank = { title: "", body: "", flair: "General" };
    setNewPost(blank);
    saveJson(DRAFT_KEY, blank);
  };

  /* search / filters / sort / my posts / tab */
  const [tab, setTab] = useState("all"); // all | saved
  const [search, setSearch] = useState("");
  const [activeFlairs, setActiveFlairs] = useState([]);
  const [sort, setSort] = useState("top"); // top | new
  const [onlyMine, setOnlyMine] = useState(false);

  /* pagination */
  const PER_PAGE = 6;
  const [page, setPage] = useState(1);

  /* computed list */
  const baseList = useMemo(() => {
    let list = [...posts];
    if (tab === "saved") {
      const s = new Set(saved);
      list = list.filter((p) => s.has(p.id));
    }
    return list;
  }, [posts, tab, saved]);

  const filtered = useMemo(() => {
    let out = [...baseList];

    if (onlyMine) out = out.filter((p) => p.author === "You");

    if (activeFlairs.length > 0) {
      const s = new Set(activeFlairs);
      out = out.filter((p) => s.has(p.flair));
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      out = out.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.body && p.body.toLowerCase().includes(q))
      );
    }

    if (sort === "top") out.sort((a, b) => b.votes - a.votes || b.createdAt - a.createdAt);
    if (sort === "new") out.sort((a, b) => b.createdAt - a.createdAt);

    return out;
  }, [baseList, search, activeFlairs, sort, onlyMine]);

  const paged = filtered.slice(0, page * PER_PAGE);
  const hasMore = filtered.length > paged.length;

  /* actions */
  const upvote = (id) =>
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, votes: p.votes + 1 } : p)));
  const downvote = (id) =>
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, votes: Math.max(0, p.votes - 1) } : p)));
  const deletePost = (id) => setPosts((prev) => prev.filter((p) => p.id !== id));

  const toggleSaved = (id) =>
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const sharePost = async (post) => {
    const text = `MannMitra Community: ${post.title}${post.body ? " — " + post.body : ""}`;
    try {
      await navigator.clipboard.writeText(text);
      alert("Post copied to clipboard!");
    } catch {
      alert(text);
    }
  };

  const toggleFlair = (f) =>
    setActiveFlairs((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  const clearFilters = () => setActiveFlairs([]);

  const submitPost = () => {
    if (!newPost.title.trim()) return;
    const post = {
      id: Date.now(),
      author: "You",
      flair: newPost.flair || "General",
      title: newPost.title.trim(),
      body: newPost.body.trim(),
      votes: 0,
      comments: 0,
      createdAt: Date.now(),
    };
    setPosts((p) => [post, ...p]);
    clearDraft();
    setComposerOpen(false);
    setOnlyMine(true);
    setTab("all");
  };

  /* comments drawer */
  const [openCommentsFor, setOpenCommentsFor] = useState(null); // post object or null
  const [newComment, setNewComment] = useState("");
  const openComments = (post) => { setOpenCommentsFor(post); setNewComment(""); };
  const closeComments = () => setOpenCommentsFor(null);
  const addComment = () => {
    if (!openCommentsFor || !newComment.trim()) return;
    const alias = aliasFor("You");
    const next = [
      ...getComments(openCommentsFor.id),
      { id: Date.now(), text: newComment.trim(), author: alias, createdAt: Date.now() },
    ];
    setComments(openCommentsFor.id, next);
    setNewComment("");
  };
  const deleteComment = (postId, id) => {
    const next = getComments(postId).filter((c) => c.id !== id);
    setComments(postId, next);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-rose-100">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-wrap gap-3 items-center justify-between">
          {/* Tabs + title */}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-rose-600">Community</h1>
            <div className="ml-3 inline-flex rounded-2xl border border-rose-100 bg-white p-1 shadow-sm">
              <button
                onClick={() => { setTab("all"); setPage(1); }}
                className={
                  "px-3 py-1.5 rounded-xl text-sm " +
                  (tab === "all" ? "bg-rose-500 text-white" : "text-rose-600 hover:bg-rose-50")
                }
              >
                All
              </button>
              <button
                onClick={() => { setTab("saved"); setPage(1); }}
                className={
                  "px-3 py-1.5 rounded-xl text-sm " +
                  (tab === "saved" ? "bg-rose-500 text-white" : "text-rose-600 hover:bg-rose-50")
                }
              >
                Saved
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Desktop search */}
            <div className="hidden md:block relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search posts…"
                className="pl-9 pr-3 py-2 rounded-xl border border-rose-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 shadow-sm"
              />
            </div>

            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 shadow-sm"
            >
              <option value="top">Top</option>
              <option value="new">New</option>
            </select>

            <button
              onClick={() => setOnlyMine((v) => !v)}
              className={
                "inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm border shadow-sm " +
                (onlyMine
                  ? "bg-rose-500 text-white border-rose-500"
                  : "bg-white text-rose-600 border-rose-200 hover:bg-rose-50")
              }
              title="Show only your posts"
            >
              <User className="h-4 w-4" />
              My posts
            </button>

            <button
              onClick={() => setComposerOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-500 text-white px-4 py-2 hover:bg-rose-600 shadow"
            >
              <Plus className="h-4 w-4" />
              New Post
            </button>
          </div>

          {/* Mobile search */}
          <div className="w-full md:hidden relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search posts…"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-rose-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 shadow-sm"
            />
          </div>
        </div>
      </header>

      {/* Flair chips */}
      <div className="mx-auto max-w-6xl px-4 pt-5">
        <div className="flex flex-wrap items-center gap-2">
          {ALL_FLAIRS.map((f) => {
            const active = activeFlairs.includes(f);
            return (
              <button
                key={f}
                onClick={() => { toggleFlair(f); setPage(1); }}
                className={
                  "transition " +
                  (active ? "ring-2 ring-rose-300 " + flairClass(f) : flairClass(f))
                }
                title={active ? "Remove filter" : "Filter by flair"}
              >
                {f}
              </button>
            );
          })}
          {activeFlairs.length > 0 && (
            <button
              onClick={() => { clearFilters(); setPage(1); }}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white border border-rose-200 text-rose-600 text-xs hover:bg-rose-50"
              title="Clear filters"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed */}
        <main className="lg:col-span-2 space-y-5">
          {paged.map((post) => {
            const commentsCount = getComments(post.id).length;
            return (
              <article
                key={post.id}
                className="group rounded-2xl bg-white border border-rose-100 shadow-md p-5 transition hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  {/* Votes */}
                  <div className="flex flex-col items-center shrink-0">
                    <button
                      aria-label="Upvote"
                      onClick={() => upvote(post.id)}
                      className="p-1.5 rounded-full hover:bg-rose-50 transition"
                      title="Send a little love"
                    >
                      <ArrowBigUp className="h-6 w-6 text-rose-600" />
                    </button>
                    <span className="text-sm font-semibold text-rose-700">{post.votes}</span>
                    <button
                      aria-label="Downvote"
                      onClick={() => downvote(post.id)}
                      className="p-1.5 rounded-full hover:bg-rose-50 transition"
                      title="Not for me"
                    >
                      <ArrowBigDown className="h-6 w-6 text-rose-600" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    {/* header line: avatar · alias · flair · time */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {(() => {
                        const display = aliasFor(post.author);
                        return (
                          <>
                            <img
                              src={avatarUrl(display)}
                              alt={display}
                              className="h-8 w-8 rounded-full border border-rose-100 shadow"
                            />
                            <span className="text-sm font-medium text-rose-700">{display}</span>
                          </>
                        );
                      })()}
                      <span className={flairClass(post.flair)}>
                        <span className="inline-flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {post.flair}
                        </span>
                      </span>
                      <span className="text-xs text-gray-500">• {timeAgo(post.createdAt)}</span>
                    </div>

                    <h3 className="mt-2 text-lg md:text-xl font-semibold break-words text-rose-700">
                      {post.title}
                    </h3>
                    {post.body && (
                      <p className="mt-1 text-gray-700 break-words">{post.body}</p>
                    )}

                    {/* actions */}
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <button
                        className="inline-flex items-center gap-1 hover:text-rose-600"
                        onClick={() => openComments(post)}
                        title="Open comments"
                      >
                        <MessageSquare className="h-4 w-4" />
                        {commentsCount} comments
                      </button>

                      <button
                        className="inline-flex items-center gap-1 hover:text-rose-600"
                        title={saved.has(post.id) ? "Unsave post" : "Save post"}
                        onClick={() => toggleSaved(post.id)}
                      >
                        {saved.has(post.id) ? (
                          <>
                            <BookmarkCheck className="h-4 w-4" />
                            Saved
                          </>
                        ) : (
                          <>
                            <Bookmark className="h-4 w-4" />
                            Save
                          </>
                        )}
                      </button>

                      <button
                        className="inline-flex items-center gap-1 hover:text-rose-600"
                        title="Copy share text"
                        onClick={() => sharePost(post)}
                      >
                        <Share2 className="h-4 w-4" />
                        Share
                      </button>

                      {post.author === "You" && (
                        <button
                          onClick={() => deletePost(post.id)}
                          className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700"
                          title="Delete your post"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {paged.length === 0 && (
            <div className="text-center text-gray-600 py-10">
              No posts match your filters/search.
            </div>
          )}

          {hasMore && (
            <div className="flex justify-center">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 shadow-sm"
              >
                Load more
              </button>
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-2xl bg-white border border-rose-100 shadow-md p-4">
            <h4 className="font-semibold text-rose-700 mb-1">About this community</h4>
            <p className="text-sm text-gray-600">
              Share tips, vent safely, and help others feel better. Be kind 💚
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-rose-100 shadow-md p-4">
            <h4 className="font-semibold text-rose-700 mb-2">Popular flairs</h4>
            <div className="flex flex-wrap gap-2">
              {ALL_FLAIRS.map((f) => {
                const active = activeFlairs.includes(f);
                return (
                  <button
                    key={f}
                    onClick={() => { toggleFlair(f); setPage(1); }}
                    className={(active ? "ring-2 ring-rose-300 " : "") + flairClass(f)}
                    title={active ? "Remove filter" : "Filter by this flair"}
                  >
                    {f}
                  </button>
                );
              })}
              {activeFlairs.length > 0 && (
                <button
                  onClick={() => { clearFilters(); setPage(1); }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white border border-rose-200 text-rose-600 text-xs hover:bg-rose-50"
                  title="Clear"
                >
                  <X className="h-3 w-3" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Saved posts */}
          <div className="rounded-2xl bg-white border border-rose-100 shadow-md p-4">
            <h4 className="font-semibold text-rose-700 mb-1">Saved posts</h4>
            {Array.from(saved).length === 0 ? (
              <p className="text-sm text-gray-600">No saved posts yet.</p>
            ) : (
              <ul className="text-sm text-gray-700 space-y-1">
                {posts.filter((p) => saved.has(p.id)).slice(0, 6).map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-2">
                    <span className="truncate">{p.title}</span>
                    <button
                      onClick={() => toggleSaved(p.id)}
                      className="text-rose-600 hover:text-rose-700"
                      title="Remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Prompt card */}
          <div className="rounded-2xl bg-white border border-rose-100 shadow-md p-4">
            <h4 className="font-semibold text-rose-700 mb-1">Today’s prompt ✨</h4>
            <p className="text-sm text-gray-600">
              Name one small thing you’re grateful for right now.
            </p>
          </div>
        </aside>
      </div>

      {/* Composer Modal */}
      {composerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
          onClick={() => setComposerOpen(false)}
        >
          <div
            className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-xl border border-rose-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold text-rose-700">Create a post</h4>
              {(newPost.title || newPost.body) && (
                <button
                  onClick={clearDraft}
                  className="text-xs px-2 py-1 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50"
                  title="Clear draft"
                >
                  Clear draft
                </button>
              )}
            </div>

            <label className="block text-sm mb-1 text-rose-700 mt-4">Title</label>
            <input
              className="w-full mb-3 px-4 py-2 border rounded-lg border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
              placeholder="What's on your mind?"
              value={newPost.title}
              onChange={(e) => setNewPost((s) => ({ ...s, title: e.target.value }))}
            />

            <label className="block text-sm mb-1 text-rose-700">Flair</label>
            <select
              className="w-full mb-3 px-4 py-2 border rounded-lg border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
              value={newPost.flair}
              onChange={(e) => setNewPost((s) => ({ ...s, flair: e.target.value }))}
            >
              <option>General</option>
              <option>Guided meditation</option>
              <option>Vent-box</option>
              <option>Professionals</option>
            </select>

            <label className="block text-sm mb-1 text-rose-700">Body (optional)</label>
            <textarea
              rows={4}
              className="w-full mb-4 px-4 py-2 border rounded-lg border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
              placeholder="Write more details here…"
              value={newPost.body}
              onChange={(e) => setNewPost((s) => ({ ...s, body: e.target.value }))}
            />

            <div className="flex flex-col-reverse sm:flex-row gap-2">
              <button
                onClick={() => setComposerOpen(false)}
                className="px-4 py-2 rounded-lg border border-rose-200 hover:bg-rose-50"
              >
                Cancel
              </button>
              <button
                onClick={submitPost}
                className="px-4 py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Drawer (modal) */}
      {openCommentsFor && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-[2px] p-4"
          onClick={closeComments}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-rose-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b bg-gradient-to-r from-rose-50 to-pink-50 flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-xs text-gray-500">Comments on</div>
                <div className="font-semibold text-rose-700 truncate">{openCommentsFor.title}</div>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-rose-50"
                onClick={closeComments}
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* List */}
            <div className="max-h-[55vh] overflow-y-auto px-5 py-4 space-y-3">
              {getComments(openCommentsFor.id).length === 0 && (
                <div className="text-sm text-gray-600">No comments yet. Start the chat ✨</div>
              )}
              {getComments(openCommentsFor.id).map((c) => (
                <div key={c.id} className="flex items-start gap-3">
                  <img
                    src={avatarUrl(c.author)}
                    alt={c.author}
                    className="h-8 w-8 rounded-full border border-rose-100 shadow"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-rose-700">{c.author}</span>
                      <span className="text-xs text-gray-500">• {timeAgo(c.createdAt)}</span>
                    </div>
                    <div className="text-sm text-gray-700 break-words">{c.text}</div>
                  </div>
                  {/* simple delete (for all, local only) */}
                  <button
                    onClick={() => deleteComment(openCommentsFor.id, c.id)}
                    className="text-rose-600 hover:text-rose-700 text-xs"
                    title="Delete comment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Composer */}
            <div className="px-5 py-4 border-t bg-rose-50/50">
              <div className="flex gap-2">
                <input
                  className="flex-1 px-4 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="Write a kind comment…"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  onClick={addComment}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600"
                >
                  <MessageSquare className="h-4 w-4" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
