// src/pages/JournalPage.js
import React, { useState, useEffect } from "react";

export default function JournalPage() {
  const [journal, setJournal] = useState([]);
  const [search, setSearch] = useState("");

  // Load saved journal entries
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("mannmitra.journal")) || [];
    setJournal(saved);
  }, []);

  // Delete an entry
  const handleDelete = (id) => {
    const updated = journal.filter((entry) => entry.id !== id);
    setJournal(updated);
    localStorage.setItem("mannmitra.journal", JSON.stringify(updated));
  };

  // Clear all entries
  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to delete all journal entries?")) {
      setJournal([]);
      localStorage.removeItem("mannmitra.journal");
    }
  };

  // Filtered list
  const filtered = journal.filter(
    (entry) =>
      entry.text.toLowerCase().includes(search.toLowerCase()) ||
      entry.date.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50 px-6 py-12">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg border border-rose-100 p-8">
        <h1 className="text-3xl font-extrabold text-rose-700 text-center mb-6">
          My Journal 📔
        </h1>
        <p className="text-center text-gray-700 mb-8">
          All your saved thoughts from Vent Boxes appear here.  
          Private, personal, and just for you.
        </p>

        {/* Search + Clear */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search journal entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          {journal.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 shadow"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Journal Entries */}
        {filtered.length === 0 ? (
          <p className="text-gray-600 text-center">
            {journal.length === 0
              ? "No saved entries yet."
              : "No entries match your search."}
          </p>
        ) : (
          <ul className="space-y-4">
            {filtered.map((entry) => (
              <li
                key={entry.id}
                className="p-4 border border-rose-100 rounded-xl shadow-sm bg-rose-50 flex justify-between items-start"
              >
                <div>
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {entry.text}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{entry.date}</p>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="ml-4 text-sm text-rose-600 hover:text-rose-800"
                  title="Delete entry"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
