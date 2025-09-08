// src/pages/StressQuestionnaire.js
import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

// custom hook
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

export default function StressQuestionnaire() {
  const questions = [
    "In the last month, how often have you been upset because of something that happened unexpectedly?",
    "In the last month, how often have you felt that you were unable to control the important things in your life?",
    "In the last month, how often have you felt nervous and 'stressed'?",
    "In the last month, how often have you felt confident about your ability to handle your personal problems?",
    "In the last month, how often have you felt that things were going your way?",
    "In the last month, how often have you found that you could not cope with all the things you had to do?",
    "In the last month, how often have you been able to control irritations in your life?",
    "In the last month, how often have you felt that you were on top of things?",
    "In the last month, how often have you been angered because of things that were outside of your control?",
    "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
  ];

  const options = [
    { label: "Never", value: 0 },
    { label: "Almost Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Fairly Often", value: 3 },
    { label: "Very Often", value: 4 },
  ];

  const [answers, setAnswers] = useState(Array(10).fill(null));
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

    // Reverse score for positively worded items (4, 5, 7, 8)
    const reverse = [3, 4, 6, 7]; // zero-based indexes
    const adjusted = answers.map((val, idx) =>
      reverse.includes(idx) ? 4 - val : val
    );

    const total = adjusted.reduce((a, b) => a + b, 0);
    setScore(total);
    setShowResult(true);
  };

  const getInterpretation = (total) => {
    if (total <= 13) return "Low Stress";
    if (total <= 26) return "Moderate Stress";
    return "High Stress";
  };

  const navigate = useNavigate();
  const { width, height } = useWindowSize();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg border border-rose-100 p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-rose-700 mb-6 text-center">
          Perceived Stress Scale (PSS-10)
        </h1>
        <p className="text-gray-700 text-center mb-10">
          Please answer the following questions about your feelings and thoughts
          during the last month.
        </p>

        <div className="space-y-8">
          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="p-4 rounded-xl border border-rose-100 shadow-sm bg-white"
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
                        ? "bg-rose-500 text-white border-rose-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-rose-50"
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
            className="px-6 py-3 bg-rose-600 text-white rounded-xl font-semibold shadow hover:bg-rose-700 transition"
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
              className="absolute top-4 right-4 text-gray-500 hover:text-rose-600"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-rose-700 text-center mb-4">
              Your Results
            </h2>
            <p className="text-center text-lg text-gray-700">
              Your Score: <span className="font-semibold">{score}</span>
            </p>
            <p className="text-center mt-2 text-lg">
              Interpretation:{" "}
              <span className="font-semibold text-rose-600">
                {getInterpretation(score)}
              </span>
            </p>

            {/* Extra behavior depending on result */}
            {score <= 13 && (
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
                  Amazing! 🎉 You’re managing stress really well. Keep it up!
                </p>
              </>
            )}

            {score > 13 && score <= 26 && (
              <p className="mt-4 text-center text-amber-600 font-medium">
                You’re doing better than you think ✨  
                Remember: small steps daily can make a big difference 💚
              </p>
            )}

            {score > 26 && (
              <div className="mt-6 text-center">
                <p className="text-red-600 font-medium mb-4">
                  It looks like you’re experiencing high stress 💔  
                  Let’s take a moment to calm your mind.
                </p>
                <button
                  onClick={() => {
                    setShowResult(false);
                    navigate("/meditation");
                  }}
                  className="px-5 py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600 shadow"
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
