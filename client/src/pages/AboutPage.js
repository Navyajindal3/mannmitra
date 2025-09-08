import React from "react";
import { Heart, Smile, Users, Star, Coffee, MessageCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 text-gray-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-pink-600">
            About Us 
          </h1>
          <p className="text-gray-600 text-sm">
            Learn about our mission, vision, story & values
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Mission */}
        <section className="bg-white rounded-3xl shadow-lg p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
          <Heart className="w-16 h-16 text-pink-500 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold text-pink-600">Our Mission</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              To make mental wellness approachable, affordable, and fun 🌸.
              Everyone deserves a safe space to vent, reflect, and heal without stigma.
            </p>
          </div>
        </section>

        {/* Vision */}
        <section className="bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100 rounded-3xl shadow-lg p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
          <Smile className="w-16 h-16 text-orange-500 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold text-orange-600">Our Vision</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              A world where conversations about mental health are as normal as
              sharing memes with friends 🤝. We aim to empower youth to check vibes,
              find calm, and grow resilience every day.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="bg-white rounded-3xl shadow-lg p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
          <Users className="w-16 h-16 text-green-500 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold text-green-600">Our Story</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              MannMitra was born from late-night talks about stress, exams, and
              overthinking. We realized that traditional therapy apps often feel
              formal and intimidating. So we built a hybrid solution: a friendly
              WhatsApp chatbot 🤖 + a creative website 🌐 that makes help feel human.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="bg-gradient-to-r from-yellow-100 to-pink-100 rounded-3xl shadow-lg p-8 md:p-12">
          <h2 className="text-2xl font-bold text-yellow-600 mb-6">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <Star className="w-12 h-12 text-yellow-500" />
              <h3 className="mt-3 font-semibold">Empathy First</h3>
              <p className="text-sm text-gray-600">
                We listen without judgment and value every emotion.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Coffee className="w-12 h-12 text-pink-500" />
              <h3 className="mt-3 font-semibold">Approachability</h3>
              <p className="text-sm text-gray-600">
                Conversations here should feel as natural as a chat with a friend.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <MessageCircle className="w-12 h-12 text-green-500" />
              <h3 className="mt-3 font-semibold">Community Care</h3>
              <p className="text-sm text-gray-600">
                We grow together by sharing, supporting, and uplifting each other.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-pink-600 rounded-3xl shadow-xl text-white text-center p-10">
          <h2 className="text-3xl font-extrabold">Join Our Journey 🌈</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg">
            Whether through a chatbot vent, a guided meditation, or connecting
            with professionals — MannMitra is here for you. Together, let’s
            normalize mental wellness.
          </p>
          <button className="mt-6 bg-white text-pink-600 px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 transition">
            Start Your Journey
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 px-6 py-10 mt-16 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} MannMitra — Together, for your mind 💚
        </p>
      </footer>
    </div>
  );
}
