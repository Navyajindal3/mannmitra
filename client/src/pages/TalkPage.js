// src/pages/TalkPage.js
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

/* ---------- Modal via Portal (isolated, bullet-proof) ---------- */
function StartChatModal({ open, companion, acknowledged, onAck, onClose, onConfirm }) {
  if (!open) return null;
  // Render into <body> to avoid stacking context issues
  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647, // very high to beat any UI
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: "1rem",
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          width: "min(90vw, 640px)",
          background: "white",
          borderRadius: "1.5rem",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
        className="border border-rose-100"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-rose-50 to-orange-50 border-b">
          <div className="flex items-center gap-4">
            <img
              src={companion?.avatar || "/assets/dadi.png"}
              alt={companion?.name || "Companion"}
              className="w-16 h-16 rounded-full border-4 border-white shadow object-cover"
              onError={(e) => (e.currentTarget.src = "/assets/dadi.png")}
            />
            <div className="min-w-0">
              <h4 className="text-xl font-bold text-rose-700 truncate">
                {companion?.name || "Companion"}
              </h4>
              <p className="text-sm text-gray-600">
                {companion?.subtitle || "Let’s start a supportive chat."}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-gray-700">
            You’re about to start a supportive chat with{" "}
            <span className="font-semibold text-rose-700">
              {companion?.name || "your companion"}
            </span>
            . This is a safe, non-judgmental space to share your thoughts.
          </p>

          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Conversations are private on your device.</li>
            <li>Replies may be AI-assisted; for emergencies, call your local helpline.</li>
            <li>You can switch personas anytime from the chat header.</li>
          </ul>

          <label className="flex items-start gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => onAck(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
            />
            <span>
              I understand this is a supportive chat and not a substitute for professional care.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 bg-gray-50 border-t flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 hover:bg-white"
          >
            Not Now
          </button>
          <button
            onClick={acknowledged ? onConfirm : undefined}
            disabled={!acknowledged}
            className={`flex-1 px-4 py-2 rounded-xl font-semibold shadow ${acknowledged
              ? "bg-rose-500 text-white hover:bg-rose-600"
              : "bg-rose-300 text-white cursor-not-allowed"
              }`}
          >
            Chat Now
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function TalkPage() {
  /* -------- Vent box state -------- */
  const [ventText, setVentText] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  /* -------- Speech to text -------- */
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const recog = new SR();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = "en-IN";
      recog.onresult = (e) => {
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const transcript = e.results[i][0].transcript;
          if (e.results[i].isFinal) {
            setVentText((t) => (t + " " + transcript).trim());
          }
        }
      };
      recog.onend = () => setListening(false);
      recognitionRef.current = recog;
    }
  }, []);

  const toggleListening = () => {
    const recog = recognitionRef.current;
    if (!recog) return alert("Speech not supported in this browser.");
    if (listening) {
      recog.stop();
      setListening(false);
    } else {
      try {
        recog.start();
        setListening(true);
      } catch { }
    }
  };

  const handleDump = () => {
    if (!ventText.trim()) return;
    setVentText("");
  };

  const handleSaveToJournal = () => {
    if (!ventText.trim()) return;
    const saved = JSON.parse(localStorage.getItem("mannmitra.journal")) || [];
    const entry = {
      id: Date.now(),
      text: ventText.trim(),
      date: new Date().toLocaleString(),
    };
    localStorage.setItem("mannmitra.journal", JSON.stringify([entry, ...saved]));
    setVentText("");
    alert("Saved to Journal 💌");
  };

  /* -------- Helpers -------- */
  const navigate = useNavigate();
  const slugify = (s) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  /* -------- Companions (2×2) -------- */
  const companions = [
    {
      name: "Sunita Daadi",
      subtitle: "Dil halka kar le, main sun rahi hoon 💚",
      avatar: "/assets/dadi.png",
      gradient: "from-green-100 to-emerald-200",
    },
    {
      name: "Aditya (Best Friend)",
      subtitle: "Mood off? Chal memes dekhte hain 😂",
      avatar: "/assets/rahul.png",
      gradient: "from-rose-100 to-pink-200",
    },
    {
      name: "Sandeep Sir (Mentor)",
      subtitle: "Pressure se plan banta hai. I’m with you.",
      avatar: "/assets/sandeep sir.png",
      gradient: "from-blue-100 to-indigo-200",
    },
    {
      name: "Shraddha Didi",
      subtitle: "Don’t overthink — I’m right here 💜",
      avatar: "/assets/didi.png",
      gradient: "from-purple-100 to-fuchsia-200",
    },
  ].map((c) => ({ ...c, slug: slugify(c.name) }));

  /* -------- Start Chat Modal state -------- */
  const [openModal, setOpenModal] = useState(false);
  const [selectedCompanion, setSelectedCompanion] = useState(null);
  const [acknowledged, setAcknowledged] = useState(false);

  const openStartChat = (comp) => {
    setSelectedCompanion(comp || null);
    setAcknowledged(false);
    setOpenModal(true);
  };
  const closeStartChat = () => {
    setOpenModal(false);
    setSelectedCompanion(null);
    setAcknowledged(false);
  };
  const goToChat = () => {
    const slug = selectedCompanion?.slug || "sunita-daadi";
    setOpenModal(false);
    navigate(`/chat/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-rose-700">
            Spill the Tea ☕
          </h1>
          <p className="mt-3 text-gray-700 text-lg">
            Vent, talk, or just type it out — this is your safe space.
          </p>
        </div>

        {/* Companions grid (2×2) */}
        <section>
          <h2 className="text-2xl font-bold text-rose-700 mb-6 text-center">
            Choose Your Companion
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {companions.map((c, i) => (
              <div
                key={i}
                className={`rounded-3xl bg-gradient-to-br ${c.gradient} p-8 shadow-lg border border-white/60 flex items-center gap-6`}
              >
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-36 h-36 md:w-40 md:h-40 rounded-full border-4 border-white shadow object-cover"
                  onError={(e) => (e.currentTarget.src = "/assets/dadi.png")}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-extrabold text-rose-700 truncate">
                    {c.name}
                  </h3>
                  <p className="text-gray-700 mt-2">{c.subtitle}</p>
                  <button
                    onClick={() => openStartChat(c)}
                    className="mt-5 px-5 py-3 rounded-xl bg-rose-500 text-white font-semibold shadow hover:bg-rose-600"
                  >
                    Start Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vent Box */}
        <section className="bg-white rounded-3xl shadow-lg border border-rose-100 p-8">
          <h2 className="text-2xl font-bold text-rose-700 mb-4">Vent Box ✍️</h2>
          <textarea
            value={ventText}
            onChange={(e) => setVentText(e.target.value)}
            placeholder="Type or speak what’s on your mind..."
            className="w-full h-40 p-4 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
          />
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={toggleListening}
              className={`flex-1 px-4 py-2 rounded-xl font-semibold shadow ${listening
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-rose-500 text-white hover:bg-rose-600"
                }`}
            >
              🎤 {listening ? "Stop Speaking" : "Start Speaking"}
            </button>
            <button
              onClick={handleDump}
              className="flex-1 px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100"
            >
              Release & Delete
            </button>
            <button
              onClick={handleSaveToJournal}
              className="flex-1 px-4 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 shadow"
            >
              Save to Journal
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Tip: Saved vents appear in your <span className="font-semibold">Journal</span> tab.
          </p>
        </section>
        {/* Gentle help card */}
        <section className="bg-gradient-to-r from-rose-100 to-orange-100 rounded-3xl shadow p-6 text-center">
          <h3 className="text-lg font-bold text-rose-700 mb-2">Need Help?</h3>
          <p className="text-gray-700 text-sm"> If you ever feel overwhelmed, you’re not alone. Please reach out to a trusted friend, family member, or professional. </p>
          <p className="text-sm text-gray-700 mt-2"> 📞 Helpline: +91 9152987821 (India) | 1-800-662-HELP (US) </p>
        </section>
      </div>

      {/* Start Chat Modal (Portal) */}
      <StartChatModal
        open={openModal}
        companion={selectedCompanion}
        acknowledged={acknowledged}
        onAck={setAcknowledged}
        onClose={closeStartChat}
        onConfirm={goToChat}
      />
    </div>
  );
}
