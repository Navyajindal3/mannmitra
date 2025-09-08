// src/App.js
import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import CommunityPage from "./pages/CommunityPage";
import ProfilePage from "./pages/ProfilePage";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, ChevronDown } from "lucide-react";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import { useNavigate } from "react-router-dom";
import ScreeningPage from "./pages/ScreeningPage";
import TalkPage from "./pages/TalkPage";
import MeditationPage from "./pages/MeditationPage";
import StressQuestionnaire from "./pages/StressQuestionnaire";
import AnxietyQuestionnaire from "./pages/AnxietyQuestionnaire";
import DepressionQuestionnaire from "./pages/DepressionQuestionnaire";
import JournalPage from "./pages/JournalPage";
import ChatPage from "./pages/ChatPage";

const AVATARS = {
  daadi: "/assets/dadi.png",
  bestfriend: "/assets/rahul.png",
  mentor: "/assets/sandeep sir.png",
  didi: "/assets/didi.png",
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/screening" element={<ScreeningPage />} />
      <Route path="/talk" element={<TalkPage />} />
      <Route path="/meditation" element={<MeditationPage />} />
      <Route path="/screening/stress" element={<StressQuestionnaire />} />
      <Route path="/screening/anxiety" element={<AnxietyQuestionnaire />} />
      <Route path="/screening/depression" element={<DepressionQuestionnaire />} />
      <Route path="/journal" element={<JournalPage />} />
      <Route path="/chat/:companion" element={<ChatPage />} />



    </Routes>
  );
}

function HomePage() {
  const navigate = useNavigate();

  /* ---------- Headings ---------- */
  const heroHeadings = [
    "Your Mind, Your Safe Space",
    "You’re Heard. You’re Safe.",
    "Healing Starts With Talking.",
    "Check Vibes. Find Calm. Repeat.",
  ];
  const spillHeadings = ["Spill Your Heart Here", "No Filters, Just Feels", "Talk It Out, Yaar"];
  const ventHeadings = [
    "Unload Your Overthinking Backpack.",
    "Your Safe Space For Messy Feels.",
    "Shout In Text. Zero Consequences.",
  ];

  const [heroIndex, setHeroIndex] = useState(0);
  const [spillIndex, setSpillIndex] = useState(0);
  const [ventIndex, setVentIndex] = useState(0);
  const [showLogin, setShowLogin] = useState(false);

  /* ---------- Vent box ---------- */
  const [ventText, setVentText] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  /* ---------- Scroll targets ---------- */
  const cardRefs = {
    screening: useRef(null),
    talk: useRef(null),
    meditation: useRef(null),
  };



  /* ---------- Rotating headings ---------- */
  useEffect(() => {
    const id = setInterval(
      () => setHeroIndex((i) => (i + 1) % heroHeadings.length),
      3000
    );
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const id = setInterval(
      () => setSpillIndex((i) => (i + 1) % spillHeadings.length),
      3800
    );
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const id = setInterval(
      () => setVentIndex((i) => (i + 1) % ventHeadings.length),
      4200
    );
    return () => clearInterval(id);
  }, []);

  /* ---------- Speech to text ---------- */
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
          if (e.results[i].isFinal)
            setVentText((t) => (t + " " + transcript).trim());
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
  const handleVentSubmit = () => {
    if (!ventText.trim()) return;
    setVentText("");
  };

  const scrollToCard = (key) => {
    cardRefs[key]?.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  /* ---------- Feature cards ---------- */
  const bigCards = [
    {
      key: "screening",
      title: "Mood Scan",
      desc: "2–3 minute check-ins for stress, anxiety, and mood. Private results with next steps you can actually use today.",
      points: [
        "Science-Backed Questionnaires",
        "Instant Risk Snapshot",
        "Personalized Tips & Referrals",
      ],
      cta: "Start A Quick Check",
      bg: "from-rose-500 to-pink-500",
      gif: "/assets/Customer Survey.gif",
    },
    {
      key: "talk",
      title: "Spill the Tea",
      desc: "Chat with a warm, non-judgy companion in minutes — Daadi, Best-Friend, Mentor, or Didi. Vent first, plan next.",
      points: ["4 Empathy Personas", "Multilingual Friendly", "Escalation To Human Help"],
      cta: "Open A Safe Chat",
      bg: "from-violet-500 to-fuchsia-500",
      gif: "/assets/Conversation.gif",
    },
    {
      key: "meditation",
      title: "Zen Mode",
      desc: "Take a pause to breathe, ground yourself, and build inner calm through short guided sessions.",
      points: ["Quick Guided Exercises", "Reduce Stress & Improve Focus", "Daily Mindfulness Practice"],
      cta: "Start Meditating",
      bg: "from-emerald-500 to-teal-500",
      gif: "/assets/meditation.gif",
    },
  ];

  /* ---------- Chatbot tiles ---------- */
  const chatbot = [
    {
      title: "Talk To Your Sunita Daadi",
      subtitle: "Dil Halka Kar Le, Main Sun Rahi Hoon.",
      avatar: AVATARS.daadi,
      bg: "bg-rose-50",
    },
    {
      title: "Talk To Your Friend Aditya",
      subtitle: "Mood off? Chal memes dekhte hai!",
      avatar: AVATARS.bestfriend,
      bg: "bg-amber-50",
    },
    {
      title: "Talk To Your Mentor, Sandeep Sir",
      subtitle: "Pressure se plan banta hai. I’m with you.",
      avatar: AVATARS.mentor,
      bg: "bg-orange-50",
    },
    {
      title: "Talk To Your Shraddha Didi",
      subtitle: "Don’t overthink — I’m right here.",
      avatar: AVATARS.didi,
      bg: "bg-pink-50",
    },
  ];

  /* ---------- Demo auth ---------- */
  const demoUsers = [
    { phone: "+919876543210", otp: "1234" },
    { phone: "+919123456789", otp: "5678" },
  ];
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    const user = demoUsers.find((u) => u.phone === phone && u.otp === otp);
    if (user) {
      setIsLoggedIn(true);
      setShowLogin(false);
      alert("Login successful");
    } else {
      alert("Invalid credentials.");
    }
  };

  /* ---------- Professionals ---------- */
  const professionals = [
    {
      name: "Dr. A. Sharma",
      spec: "Clinical Psychologist",
      exp: "10 Yrs",
      phone: "+91 98765 43210",
      location: "Delhi, India",
      photo: "/assets/asharma.jpg",
      email: "asharmaclinic@gmail.com",
    },
    {
      name: "Dr. N. Verma",
      spec: "Therapist",
      exp: "7 Yrs",
      phone: "+91 98765 87654",
      location: "Mumbai, India",
      photo: "/assets/nverma.jpg",
      email: "nvermatherapy@gmail.com",
    },
    {
      name: "Dr. R. Singh",
      spec: "Counsellor",
      exp: "5 Yrs",
      phone: "+91 91234 56789",
      location: "Bangalore, India",
      photo: "/assets/rsingh.jpg",
      email: "rsinghcounsel@gmail.com",
    },
  ];

  const [selectedPro, setSelectedPro] = useState(null);
  const affirmations = [
    "Breathe. Relax. Let go of what you can't control 🌸",
    "Small steps every day create big changes 💚",
    "Your feelings are valid — honor them 💭",
    "Pause. Inhale calm. Exhale stress 🌿",
  ];

  const [quote, setQuote] = useState(affirmations[0]);
  useEffect(() => {
    const id = setInterval(() => {
      setQuote(
        affirmations[Math.floor(Math.random() * affirmations.length)]
      );
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const moods = ["😊", "😟", "😢", "😡", "😴"];
  const [moodHistory, setMoodHistory] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [feedback, setFeedback] = useState("");

  // Load saved moods on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("mannmitra.moodHistory")) || [];
    setMoodHistory(saved);
    if (saved.length > 0) setSelectedMood(saved[0].emoji);
  }, []);

  // Handle mood selection
  const handleMoodSelect = (mood) => {
    const entry = {
      emoji: mood,
      date: new Date().toLocaleString(),
    };
    const updated = [entry, ...moodHistory];
    setMoodHistory(updated);
    setSelectedMood(mood);
    localStorage.setItem("mannmitra.moodHistory", JSON.stringify(updated));

    // Set feedback message
    const feedbackMap = {
      "😊": "Glad you’re feeling good today! 🌸",
      "😟": "It’s okay to feel low. Take a mindful break 💚",
      "😢": "Sending you a virtual hug 🤗 You’re not alone.",
      "😡": "Breathe it out. Anger passes like a storm ⛈️",
      "😴": "Rest is self-care. Take it easy 💤",
    };
    setFeedback(feedbackMap[mood]);

    // Clear feedback after 5 seconds
    setTimeout(() => setFeedback(""), 5000);
  };
  const [journal, setJournal] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("mannmitra.journal")) || [];
    setJournal(saved);
  }, []);

  const handleSaveToJournal = () => {
    if (!ventText.trim()) return;
    const newEntry = {
      id: Date.now(),
      text: ventText.trim(),
      date: new Date().toLocaleString(),
    };
    const updated = [newEntry, ...journal];
    setJournal(updated);
    localStorage.setItem("mannmitra.journal", JSON.stringify(updated));
    setVentText("");
  };



  return (
    <div className="bg-white min-h-screen text-gray-900">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white/80 backdrop-blur z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <img
              src="assets/MannMitra.png"
              alt="MannMitra logo"
              className="h-10 w-auto object-contain"
            />
            <span className="text-2xl font-extrabold text-rose-600">MannMitra</span>
          </a>
        </div>

        <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
          <Link to="/profile" className="hover:text-rose-600 capitalize">
            Profile
          </Link>

          {/* Features dropdown */}
          <div className="relative group">
            <button className="inline-flex items-center gap-1 hover:text-rose-600 capitalize">
              Features
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <div className="absolute left-0 mt-2 w-56 rounded-xl border bg-white shadow-lg ring-1 ring-black/5 p-2
                            opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                            translate-y-2 transition-all duration-200 ease-out z-50">
              <a href="/#screening" className="block rounded-lg px-3 py-2 text-sm hover:bg-rose-50">Mood Scan</a>
              <a href="/#talk" className="block rounded-lg px-3 py-2 text-sm hover:bg-rose-50">Spill the Tea</a>
              <a href="/#meditation" className="block rounded-lg px-3 py-2 text-sm hover:bg-rose-50">Zen Mode</a>
              <a href="/#vent-box" className="block rounded-lg px-3 py-2 text-sm hover:bg-rose-50">Vent-box</a>
              <a href="/#professionals" className="block rounded-lg px-3 py-2 text-sm hover:bg-rose-50">Connect With Professionals</a>
            </div>
          </div>

          <Link to="/about" className="hover:text-rose-600 capitalize">
            About
          </Link>
          <Link to="/contact" className="hover:text-rose-600 capitalize">
            Contact Us
          </Link>
          <Link to="/community" className="hover:text-rose-600 capitalize">
            Community
          </Link>
          <Link to="/journal" className="hover:text-rose-600 capitalize">
            Journal
          </Link>

        </nav>

        <div>
          {isLoggedIn ? (
            <span className="text-sm text-gray-700">Logged in</span>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="bg-rose-500 text-white px-4 py-2 rounded-xl shadow hover:bg-rose-600 capitalize"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="text-center py-16 px-4">
          <motion.h1
            key={heroIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-rose-700 capitalize"
          >
            {heroHeadings[heroIndex]}
          </motion.h1>

          <p className="mt-6 text-lg text-gray-700 max-w-2xl mx-auto capitalize">
            MannMitra blends quick screenings, empathetic listeners, and bite-sized learn tools — all in one safe place.
          </p>

          {/* Capsule CTAs (warm gradients, still on white page) */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {bigCards.map((card) => (
              <button
                key={card.key}
                onClick={() => scrollToCard(card.key)}
                className={`min-w-[220px] rounded-2xl px-8 py-5 font-semibold bg-gradient-to-r ${card.bg} text-white shadow-md hover:shadow-lg hover:scale-105 transition capitalize text-lg`}
              >
                {card.title}
              </button>
            ))}
          </div>
        </section>

        {/* Horizontally scrollable feature cards */}
        {/* Horizontally scrollable feature cards */}
        <section className="mt-4 px-4">
          <div className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth">
            {bigCards.map((card) => (
              <div
                key={card.key}
                id={card.key}
                ref={cardRefs[card.key]}
                className={`w-[85vw] md:w-[900px] flex-none rounded-3xl overflow-hidden shadow-lg border border-rose-100 bg-gradient-to-br ${card.bg} text-white`}
              >
                <div className="grid md:grid-cols-2 gap-6 items-center p-6 md:p-10">
                  <div className="flex items-center justify-center">
                    <img
                      src={card.gif}
                      alt={card.title}
                      className="w-80 h-80 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-3xl md:text-4xl font-extrabold capitalize">
                      {card.title}
                    </h3>
                    <p className="mt-4 text-white/90 text-lg capitalize">{card.desc}</p>
                    <ul className="mt-5 space-y-2">
                      {card.points.map((p) => (
                        <li
                          key={p}
                          className="flex items-start gap-2 text-white/95 capitalize text-base"
                        >
                          <span className="mt-1 inline-block h-2 w-2 rounded-full bg-white/90"></span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => {
                        if (card.key === "screening") navigate("/screening");
                        if (card.key === "talk") navigate("/talk");
                        if (card.key === "meditation") navigate("/meditation");
                      }}
                      className="mt-6 inline-flex items-center gap-2 bg-white text-rose-700 px-5 py-3 rounded-xl font-semibold shadow hover:bg-rose-50 capitalize"
                    >
                      {card.cta}
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* Chatbot pluck cards */}
        {/* Chatbot pluck cards */}
        <section id="talk" className="px-6 py-12">
          <motion.h2
            key={spillIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-rose-700 capitalize"
          >
            {spillHeadings[spillIndex]}
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-6 px-4">
            {chatbot.map((c, idx) => (
              <button
                key={idx}
                onClick={() => setShowLogin(true)}
                className={`${c.bg} w-72 md:w-80 h-[340px] flex-none rounded-3xl shadow-md border border-rose-100 flex flex-col items-center justify-between p-6 hover:shadow-lg transition`}
              >
                {/* Avatar */}
                <div className="flex-1 flex items-center justify-center">
                  <img
                    src={c.avatar}
                    alt={`${c.title} Avatar`}
                    className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow"
                  />
                </div>

                {/* Text */}
                <div className="mt-6 text-center">
                  <div className="text-lg md:text-xl font-extrabold text-rose-700 capitalize">
                    {c.title}
                  </div>
                  <div className="text-sm text-gray-700 mt-2 capitalize">{c.subtitle}</div>
                </div>
              </button>
            ))}
          </div>
        </section>


        {/* Vent Box */}
        <section id="vent-box" className="px-6 py-12">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <motion.h3
                key={ventIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-extrabold text-rose-700 capitalize"
              >
                {ventHeadings[ventIndex]}
              </motion.h3>
              <p className="text-gray-700 mt-2 capitalize">
                Your digital diary that actually listens.
              </p>
            </div>
            <div className="p-[2px] rounded-2xl bg-gradient-to-r from-rose-400 to-amber-400 shadow-lg">
              <div className="rounded-xl bg-white">
                <textarea
                  value={ventText}
                  onChange={(e) => setVentText(e.target.value)}
                  placeholder="Type or speak your thoughts..."
                  className="w-full h-44 p-4 rounded-xl bg-white resize-none outline-none capitalize"
                />
                <div className="flex items-center justify-between gap-3 p-3 pt-0">
                  <button
                    onClick={toggleListening}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold shadow ${listening
                        ? "bg-rose-600 text-white"
                        : "bg-rose-500 text-white hover:bg-rose-600"
                      }`}
                  >
                    {listening ? "Stop Speaking" : "Start Speaking"}
                  </button>

                  <button
                    onClick={handleVentSubmit}
                    className="flex-1 px-4 py-2 rounded-lg font-semibold shadow bg-amber-500 text-white hover:bg-amber-600 transition"
                  >
                    Dump
                  </button>

                  <button
                    onClick={handleSaveToJournal}
                    className="flex-1 px-4 py-2 rounded-lg font-semibold shadow bg-rose-400 text-white hover:bg-rose-500 transition"
                  >
                    Save to Journal
                  </button>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Professionals */}
        {/* Professionals */}
        <section id="professionals" className="px-6 py-16">
          <div className="max-w-6xl mx-auto text-center mb-12">
            <h3 className="text-4xl md:text-5xl font-extrabold text-rose-700">
              Connect With Professionals Near You
            </h3>
            <p className="text-gray-700 mt-3 text-lg">
              You are not alone in this, we’ve got you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {professionals.map((p, i) => (
              <div
                key={i}
                onClick={() => setSelectedPro(p)}
                className="relative rounded-3xl overflow-hidden shadow-lg group cursor-pointer border border-rose-100 hover:shadow-xl transition"
              >
                <img
                  src={p.photo}
                  alt={p.name}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-left text-white">
                  <h4 className="text-2xl font-bold">{p.name}</h4>
                  <p className="text-sm">{p.spec}</p>
                  <p className="text-xs mt-2 opacity-90">Experience: {p.exp}</p>
                  <p className="text-xs">{p.location}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          {/* Modal */}
          {selectedPro && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setSelectedPro(null)}
            >
              <div
                className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  onClick={() => setSelectedPro(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-rose-600"
                >
                  ✕
                </button>

                {/* Header */}
                <div className="flex flex-col items-center text-center">
                  <img
                    src={selectedPro.photo}
                    alt={selectedPro.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-rose-100 shadow mb-4"
                  />
                  <h4 className="text-2xl font-bold text-rose-700">{selectedPro.name}</h4>
                  <p className="text-gray-600">{selectedPro.spec}</p>
                </div>

                {/* Details */}
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-sm text-gray-700">
                    <span><strong>Experience:</strong> {selectedPro.exp}</span>
                    <span><strong>Location:</strong> {selectedPro.location}</span>
                  </div>

                  <div className="text-sm text-gray-700">
                    <p><strong>Phone:</strong> {selectedPro.phone}</p>
                    <p><strong>Email:</strong> {selectedPro.email}</p>

                  </div>

                  <div className="text-sm text-gray-700">
                    <p><strong>Availability:</strong></p>
                    <ul className="list-disc list-inside ml-2">
                      <li>Mon–Fri: 10 AM – 6 PM</li>
                      <li>Sat: 11 AM – 3 PM</li>
                    </ul>
                  </div>

                  <div className="text-sm text-gray-700">
                    <p><strong>About:</strong></p>
                    <p className="mt-1 text-gray-600">
                      {selectedPro.name} is a compassionate {selectedPro.spec.toLowerCase()}
                      with over {selectedPro.exp} of experience helping individuals manage
                      stress, anxiety, and emotional challenges. Known for a warm and empathetic
                      approach, {selectedPro.name.split(" ")[1]} believes in making mental health
                      care accessible and stigma-free.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-3">
                  <button
                    className="w-full bg-rose-500 text-white py-3 rounded-xl font-semibold shadow hover:bg-rose-600 transition"
                  >
                    Book Your Online Session Now
                  </button>
                </div>
              </div>
            </div>
          )}

        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 px-6 py-12 mt-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h2 className="text-2xl font-extrabold text-white">MannMitra</h2>
            <p className="mt-3 text-sm text-gray-400">
              Your safe space for screenings, chats & learning. We listen, we guide, we care.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="hover:text-white">About Us</a></li>
              <li><a href="#contact" className="hover:text-white">Contact</a></li>
              <li><a href="#professionals" className="hover:text-white">Find Professionals</a></li>
              <li><a href="#meditation" className="hover:text-white">Guided Meditation</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#faqs" className="hover:text-white">FAQs</a></li>
              <li><a href="#help" className="hover:text-white">Help Center</a></li>
              <li><a href="#privacy" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition"
              >
                <Facebook className="w-6 h-6 text-white" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-pink-500 transition"
              >
                <Instagram className="w-6 h-6 text-white" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-sky-500 transition"
              >
                <Twitter className="w-6 h-6 text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 text-sm text-center text-gray-500">
          © {new Date().getFullYear()} MannMitra. All rights reserved.
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowLogin(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-xl font-bold mb-3 text-rose-700 capitalize">
              Login With WhatsApp
            </h4>

            <input
              className="w-full mb-3 px-4 py-2 border rounded-lg border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              className="w-full mb-3 px-4 py-2 border rounded-lg border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <div className="space-y-3 mt-4">
              <button
                onClick={handleLogin}
                className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600"
              >
                Verify
              </button>
              <button
                onClick={() => setShowLogin(false)}
                className="w-full text-rose-700 border border-rose-200 py-2 rounded-lg hover:bg-rose-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
