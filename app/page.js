"use client";
import { useState } from "react";
import AuditForm from "../components/AuditForm.jsx";
import AuditResults from "../components/AuditResults.jsx";

export default function Home() {
  const [audit, setAudit] = useState(null);
  const [auditId, setAuditId] = useState(null);
  const [error, setError] = useState("");

  async function handleSubmit(formData) {
    setError("");
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Audit failed");
      const data = await res.json();
      setAudit(data);
      setAuditId(data.auditId);

      // Scroll to results
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
            Free · No login required
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Are you overpaying for AI tools?
          </h1>
          <p className="text-lg text-gray-500">
            Enter your current AI subscriptions and get an instant audit —
            where you&apos;re overspending, what to switch, and how much you&apos;ll save.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <AuditForm onSubmit={handleSubmit} />
          {error && (
            <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
          )}
        </div>

        {/* Results */}
        {audit && (
          <div id="results" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Your Audit Results</h2>
            <AuditResults audit={audit} auditId={auditId} />
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-12">
          Built by <a href="https://credex.rocks" className="text-indigo-400 hover:underline">Credex</a> ·
          Discounted AI credits for startups
        </p>
      </div>
    </main>
  );
}