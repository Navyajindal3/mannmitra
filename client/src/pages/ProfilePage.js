import React, { useEffect, useRef, useState } from "react";

const DEFAULT_PROFILE = {
  name: "Anonymous",
  username: "shinchan_" + Math.floor(1000 + Math.random() * 9000),
  phone: "",
  bio: "Hey! I’m exploring MannMitra 💚",
  avatar: "",
  theme: "system",
  notifyEmail: false,
  notifyWhatsapp: true,
  hideIdentity: true,
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    const raw = localStorage.getItem("mm_profile");
    if (raw) {
      try {
        setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(raw) });
      } catch {}
    }
  }, []);

  const saveProfile = () => {
    setSaving(true);
    localStorage.setItem("mm_profile", JSON.stringify(profile));
    setTimeout(() => setSaving(false), 600);
  };

  const onAvatarPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setProfile((p) => ({ ...p, avatar: reader.result }));
    reader.readAsDataURL(f);
  };

  const clearAvatar = () => setProfile((p) => ({ ...p, avatar: "" }));

  const ventCount = Number(localStorage.getItem("mm_vent_count") || 0);
  const lastLogin = localStorage.getItem("mm_last_login") || "—";

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
      <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <h1 className="text-3xl md:text-4xl font-extrabold text-pink-600">
            Your Profile
          </h1>
          <p className="text-gray-600 text-sm">
            Customize your vibe & manage preferences
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Avatar */}
        <section className="bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100 rounded-3xl shadow-lg p-8 space-y-5">
          <div className="flex items-center gap-6">
            <div className="relative">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Avatar"
                  className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="h-28 w-28 rounded-full bg-gradient-to-br from-orange-300 to-pink-400 grid place-items-center text-4xl font-bold text-white shadow-md">
                  {profile.name?.[0]?.toUpperCase() || "A"}
                </div>
              )}
              {profile.avatar && (
                <button
                  onClick={clearAvatar}
                  className="absolute -right-2 -top-2 text-xs bg-red-500 text-white px-2 py-1 rounded-full shadow"
                >
                  ✕
                </button>
              )}
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {profile.name || "Anonymous"}
              </div>
              <div className="text-sm text-gray-600">@{profile.username}</div>
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onAvatarPick}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="px-5 py-2 rounded-xl bg-pink-600 text-white hover:bg-pink-700 transition shadow"
          >
            Upload Avatar
          </button>
        </section>

        {/* Info */}
        <section className="bg-white rounded-3xl shadow-lg border p-8 space-y-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-pink-500">✨ Basic Info</h2>

          <div className="grid md:grid-cols-2 gap-5">
            <Input
              label="Display name"
              value={profile.name}
              onChange={(v) => setProfile((p) => ({ ...p, name: v }))}
            />
            <Input
              label="Public username"
              value={profile.username}
              onChange={(v) => setProfile((p) => ({ ...p, username: v }))}
            />
            <Input
              label="Phone (private)"
              value={profile.phone}
              onChange={(v) => setProfile((p) => ({ ...p, phone: v }))}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <select
                className="w-full px-4 py-2 border rounded-xl"
                value={profile.theme}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, theme: e.target.value }))
                }
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-2 border rounded-xl"
              value={profile.bio}
              onChange={(e) =>
                setProfile((p) => ({ ...p, bio: e.target.value }))
              }
            />
          </div>

          <h2 className="text-xl font-bold text-pink-500">⚙️ Preferences</h2>
          <div className="grid md:grid-cols-3 gap-3">
            <Checkbox
              label="Email updates"
              checked={profile.notifyEmail}
              onChange={(v) => setProfile((p) => ({ ...p, notifyEmail: v }))}
            />
            <Checkbox
              label="WhatsApp notifications"
              checked={profile.notifyWhatsapp}
              onChange={(v) => setProfile((p) => ({ ...p, notifyWhatsapp: v }))}
            />
            <Checkbox
              label="Hide identity in community"
              checked={profile.hideIdentity}
              onChange={(v) => setProfile((p) => ({ ...p, hideIdentity: v }))}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={saveProfile}
              className="px-5 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 shadow"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("mm_profile");
                setProfile(DEFAULT_PROFILE);
              }}
              className="px-5 py-2 rounded-xl border hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </section>

        {/* Activity */}
        <section className="bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 rounded-3xl shadow-lg p-8 lg:col-span-3">
          <h2 className="text-xl font-bold text-orange-600">📊 Your Activity</h2>
          <div className="grid md:grid-cols-3 gap-5 mt-4">
            <Stat label="Vents submitted" value={ventCount} />
            <Stat label="Last login" value={lastLogin} />
            <Stat
              label="Identity mode"
              value={profile.hideIdentity ? "Anonymous" : "Public"}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

// Reusable inputs
function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        className="w-full px-4 py-2 border rounded-xl"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white rounded-xl border p-5 shadow text-center">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
  );
}
