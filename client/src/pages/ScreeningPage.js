// src/pages/ScreeningPage.js
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ScreeningPage() {
  const navigate = useNavigate();

  const questionnaires = [
    {
      key: "stress",
      title: "Stress Questionnaire",
      desc: "Measure your stress levels with a quick, clinically validated test.",
      gradient: "from-rose-400 via-pink-400 to-orange-400",
      icon: "💭",
    },
    {
      key: "anxiety",
      title: "Anxiety Questionnaire",
      desc: "Understand your anxiety symptoms and learn how to manage them.",
      gradient: "from-indigo-400 via-violet-400 to-fuchsia-400",
      icon: "😟",
    },
    {
      key: "depression",
      title: "Depression Questionnaire",
      desc: "Screen for signs of depression with a safe and reliable tool.",
      gradient: "from-emerald-400 via-teal-400 to-cyan-400",
      icon: "🌧️",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50 px-6 py-16">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-14">
        <h1
  className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-rose-600 via-pink-600 to-orange-600 bg-clip-text text-transparent leading-tight md:leading-snug"
>
  Take a Screening
</h1>

        <p className="mt-4 text-lg text-gray-700">
          Choose from clinically validated questionnaires to check your{" "}
          <span className="font-semibold text-rose-600">stress</span>,{" "}
          <span className="font-semibold text-pink-600">anxiety</span>, and{" "}
          <span className="font-semibold text-orange-600">depression</span>{" "}
          levels — safe, private, and just for you.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {questionnaires.map((q) => (
          <button
            key={q.key}
            onClick={() => navigate(`/screening/${q.key}`)}
            className={`rounded-3xl p-[2px] bg-gradient-to-r ${q.gradient} shadow-lg hover:shadow-2xl hover:-translate-y-1 transition`}
          >
            <div className="rounded-3xl bg-white p-8 h-full flex flex-col items-center text-center">
              <div className="text-5xl mb-4">{q.icon}</div>
              <h3 className="text-2xl font-bold text-rose-700 mb-2">
                {q.title}
              </h3>
              <p className="text-gray-600 text-sm">{q.desc}</p>
              <span className="mt-6 inline-block px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold shadow hover:brightness-110">
                Start Now
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
