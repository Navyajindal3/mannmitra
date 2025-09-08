// src/pages/ChatPage.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Use the same slugifier as TalkPage
const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Keep names EXACTLY as in TalkPage, and make sure file names have no spaces.
const COMPANIONS_LIST = [
  {
    name: "Sunita Daadi",
    avatar: "/assets/dadi.png",
    color: "from-green-100 to-emerald-200",
    greeting: "Beta, dil halka kar le 💚",
  },
  {
    name: "Aditya (Best Friend)",
    avatar: "/assets/rahul.png",
    color: "from-pink-100 to-rose-200",
    greeting: "Chal memes dekhte hain 😂",
  },
  {
    name: "Sandeep Sir (Mentor)",
    avatar: "/assets/sandeep sir.png", // <- ensure the file is renamed (no space)
    color: "from-blue-100 to-indigo-200",
    greeting: "Main tumhare saath hoon, plan banate hain 📘",
  },
  {
    name: "Shraddha Didi",
    avatar: "/assets/didi.png",
    color: "from-purple-100 to-fuchsia-200",
    greeting: "Don’t overthink, I’m here 💜",
  },
];

// Build a map using the SAME slug logic
const COMPANIONS = COMPANIONS_LIST.reduce((acc, c) => {
  acc[slugify(c.name)] = c;
  return acc;
}, {});

export default function ChatPage() {
  const { companion } = useParams(); // e.g., "aditya-best-friend" or "sandeep-sir-mentor"
  const navigate = useNavigate();

  const comp = COMPANIONS[companion] || {
    name: "Companion",
    avatar: "/assets/dadi.png",
    color: "from-rose-100 to-orange-200",
    greeting: "Hi there 👋",
  };

  const [messages, setMessages] = useState([
    { sender: "companion", text: comp.greeting },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { sender: "user", text: input }]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-white shadow border-b border-rose-100">
        <button onClick={() => navigate(-1)} className="p-2 rounded hover:bg-rose-50">
          <ArrowLeft className="h-5 w-5 text-rose-700" />
        </button>
        <div className="flex items-center gap-3">
          <img
            src={comp.avatar}
            alt={comp.name}
            className="w-10 h-10 rounded-full border border-rose-200 object-cover"
          />
          <h1 className="font-bold text-rose-700">{comp.name}</h1>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`px-4 py-2 rounded-2xl shadow max-w-xs ${
                m.sender === "user"
                  ? "bg-rose-500 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-rose-100 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 shadow"
        >
          Send
        </button>
      </div>
    </div>
  );
}
