// src/pages/AnxietyQuestionnaire.js
import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

// custom hook for window size
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

export default function AnxietyQuestionnaire() {
  const questions = [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it's hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid as if something awful might happen",
  ];

  const options = [
    { label: "Not at all", value: 0 },
    { label: "Several days", value: 1 },
    { label: "More than half the days", value: 2 },
    { label: "Nearly every day", value: 3 },
  ];

  const [answers, setAnswers] = useState(Array(7).fill(null));
  const [score, setScore] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (qIndex, value) => {
    const updated = [...answers];
    updated[qIndex] = value;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    if (answers.includes(null)) {
      alert("Please answer all questions before submitting.");
      return;
    }
    const total = answers.reduce((a, b) => a + b, 0);
    setScore(total);
    setShowResult(true);
  };

  const getInterpretation = (total) => {
    if (total <= 4) return "Minimal Anxiety";
    if (total <= 9) return "Mild Anxiety";
    if (total <= 14) return "Moderate Anxiety";
    return "Severe Anxiety";
  };

  const navigate = useNavigate();
  const { width, height } = useWindowSize();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-fuchsia-50 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg border border-purple-100 p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-purple-700 mb-6 text-center">
          Generalized Anxiety Disorder (GAD-7)
        </h1>
        <p className="text-gray-700 text-center mb-10">
          Over the last 2 weeks, how often have you been bothered by the
          following problems?
        </p>

        <div className="space-y-8">
          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="p-4 rounded-xl border border-purple-100 shadow-sm bg-white"
            >
              <p className="font-medium text-gray-800 mb-4">
                {qIndex + 1}. {q}
              </p>
              <div className="flex flex-wrap gap-3">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(qIndex, opt.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                      answers[qIndex] === opt.value
                        ? "bg-purple-500 text-white border-purple-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-purple-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold shadow hover:bg-purple-700 transition"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Result Modal */}
      {showResult && score !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowResult(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowResult(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-purple-600"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-purple-700 text-center mb-4">
              Your Results
            </h2>
            <p className="text-center text-lg text-gray-700">
              Your Score: <span className="font-semibold">{score}</span>
            </p>
            <p className="text-center mt-2 text-lg">
              Interpretation:{" "}
              <span className="font-semibold text-purple-600">
                {getInterpretation(score)}
              </span>
            </p>

            {/* Dynamic result behavior */}
            {score <= 4 && (
              <>
                <div className="fixed inset-0 z-[60] pointer-events-none">
                  <Confetti
                    width={width}
                    height={height}
                    numberOfPieces={400}
                    gravity={0.5}
                    recycle={false}
                    initialVelocityX={0}
                    initialVelocityY={15}
                  />
                </div>
                <p className="mt-4 text-center text-green-600 font-medium">
                  Wonderful! 🎉 Your anxiety levels are minimal. Keep up your
                  healthy habits!
                </p>
              </>
            )}

            {score > 4 && score <= 9 && (
              <p className="mt-4 text-center text-amber-600 font-medium">
                You may have mild anxiety 💛 Try relaxation techniques, regular
                breaks, and self-care.
              </p>
            )}

            {score > 9 && score <= 14 && (
              <p className="mt-4 text-center text-orange-600 font-medium">
                You’re experiencing moderate anxiety 🧡 Consider talking to a
                counselor or using coping strategies daily.
              </p>
            )}

            {score > 14 && (
              <div className="mt-6 text-center">
                <p className="text-red-600 font-medium mb-4">
                  It looks like you’re experiencing severe anxiety 💔  
                  Guided meditation and professional support can help.
                </p>
                <button
                  onClick={() => {
                    setShowResult(false);
                    navigate("/meditation");
                  }}
                  className="px-5 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 shadow"
                >
                  Go to Meditation Page
                </button>
              </div>
            )}

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowResult(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
