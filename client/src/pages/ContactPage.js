import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: "General", message: "" });
  const [sending, setSending] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      alert("Please fill your name, email, and message.");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      alert("Thanks for reaching out! We’ll get back to you soon 💛");
      setForm({ name: "", email: "", topic: "General", message: "" });
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Hero */}
      <header className="border-b border-amber-200/60 bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-10 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-700 via-orange-700 to-rose-700">
            Contact Us
          </h1>
          <p className="mt-3 text-amber-900/80 max-w-2xl mx-auto">
            Whether you’ve got feedback, a question, or just want to say hi—our inbox is open.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: contact cards */}
        <aside className="space-y-4">
          <div className="rounded-2xl bg-white border border-amber-100 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-amber-900">Email</h3>
                <p className="text-sm text-amber-900/80">We usually reply within a day.</p>
                <a href="mailto:hello@mannmitra.app" className="text-sm font-medium text-amber-800 underline">
                  hello@mannmitra.app
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-orange-100 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="p-2 rounded-xl bg-orange-100 text-orange-800">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-amber-900">Phone / WhatsApp</h3>
                <p className="text-sm text-amber-900/80">Weekdays, 10am–6pm IST.</p>
                <p className="text-sm font-medium text-orange-800">+91 98765 43210</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-rose-100 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="p-2 rounded-xl bg-rose-100 text-rose-800">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-amber-900">Location</h3>
                <p className="text-sm text-amber-900/80">New Delhi, India</p>
                <p className="text-xs text-amber-900/70 mt-1">Remote-first team 🌍</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-amber-100 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <Clock className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-amber-900">Response Time</h3>
                <p className="text-sm text-amber-900/80">Most messages answered within 24 hours.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Right: form (spans 2 cols on desktop) */}
        <section className="lg:col-span-2">
          <div className="rounded-3xl bg-white border border-amber-100 shadow-md p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-amber-900">Send us a message</h2>
            <p className="text-sm text-amber-900/80 mt-1">
              Tell us a little about what you need—we’ll take it from there.
            </p>

            <form onSubmit={submit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-amber-900/90 mb-1">Your Name</label>
                <input
                  className="w-full px-4 py-2 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm text-amber-900/90 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  value={form.email}
                  onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                  placeholder="you@example.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-amber-900/90 mb-1">Topic</label>
                <select
                  className="w-full px-4 py-2 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  value={form.topic}
                  onChange={(e) => setForm((s) => ({ ...s, topic: e.target.value }))}
                >
                  <option>General</option>
            
                  <option>Partnerships</option>
                  <option>Press</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-amber-900/90 mb-1">Message</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  value={form.message}
                  onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                  placeholder="Write your message here…"
                />
              </div>

              <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 sm:items-center">
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow disabled:opacity-60"
                >
                  <Send className="h-5 w-5" />
                  {sending ? "Sending…" : "Send message"}
                </button>

                {/* Optional quick WhatsApp nudge */}
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-amber-200 text-amber-900 hover:bg-amber-50"
                >
                  <MessageSquare className="h-5 w-5" />
                  Ping us on WhatsApp
                </a>
              </div>
            </form>
          </div>

          {/* Small map/illustration placeholder */}
          <div className="mt-6 rounded-3xl border border-orange-100 bg-gradient-to-r from-orange-50 to-rose-50 p-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-amber-900 font-semibold">We’re remote-first</h3>
                <p className="text-amber-900/80 text-sm">
                  Our team works across time zones. Expect replies during IST hours.
                </p>
              </div>
              <div className="h-28 w-full sm:w-72 rounded-2xl bg-white border border-amber-100 shadow-sm grid place-items-center text-sm text-amber-900/70">
                Map or art placeholder
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
