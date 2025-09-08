// src/pages/MeditationPage.js
import React from "react";

export default function MeditationPage() {
  const videos = [
    {
      title: "5-Minute Guided Breathing",
      desc: "Quick reset to center yourself anytime of the day.",
      url: "https://www.youtube.com/embed/cEqZthCaMpo",
    },
    {
      title: "Morning Mindfulness",
      desc: "Start your day with calm, clarity, and focus.",
      url: "https://www.youtube.com/embed/ZToicYcHIOU",
    },
    {
      title: "Sleep Meditation",
      desc: "Relax your body and mind for a deep, restful sleep.",
      url: "https://www.youtube.com/embed/M0u9GST_j3s",
    },
  ];

  const tips = [
    "🧘 Sit comfortably and keep your spine upright.",
    "🌬️ Focus on your breath — inhale deeply, exhale slowly.",
    "💭 If your mind wanders, gently bring it back to your breath.",
    "⏳ Start with 2–5 minutes daily and increase gradually.",
    "📿 Try using calming music or guided audio if needed.",
  ];

  const tricks = [
    {
      title: "Box Breathing",
      desc: "Inhale for 4 counts → Hold 4 → Exhale 4 → Hold 4. Repeat.",
    },
    {
      title: "Body Scan",
      desc: "Focus on relaxing each part of your body from head to toe.",
    },
    {
      title: "Gratitude Pause",
      desc: "Think of 3 things you’re grateful for while breathing slowly.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700">
            Zen Mode 🌿
          </h1>
          <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
            Discover guided meditations, quick breathing tricks, and tips to
            bring calm and clarity into your daily life.
          </p>
        </div>

        {/* Guided Videos */}
        <section>
          <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
            Guided Meditation Videos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videos.map((v, idx) => (
              <div
                key={idx}
                className="rounded-2xl overflow-hidden shadow-lg border border-emerald-100 bg-white"
              >
                <iframe
                  width="100%"
                  height="200"
                  src={v.url}
                  title={v.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <div className="p-4">
                  <h3 className="font-semibold text-emerald-700">{v.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Meditation Tips */}
        <section className="bg-white rounded-3xl shadow-lg border border-emerald-100 p-8">
          <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
            Meditation Tips
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            {tips.map((t, idx) => (
              <li
                key={idx}
                className="p-4 rounded-xl bg-emerald-50 border border-emerald-100"
              >
                {t}
              </li>
            ))}
          </ul>
        </section>

        {/* Tricks & Techniques */}
        <section>
          <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
            Tricks & Techniques
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tricks.map((tr, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 shadow-md"
              >
                <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                  {tr.title}
                </h3>
                <p className="text-sm text-gray-700">{tr.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing Note */}
        <div className="text-center mt-12">
          <p className="text-gray-700 text-lg">
            🌸 Remember: Meditation is a journey, not a destination. Start small
            and enjoy the calm moments. Your mind will thank you 💚
          </p>
        </div>
      </div>
    </div>
  );
}
