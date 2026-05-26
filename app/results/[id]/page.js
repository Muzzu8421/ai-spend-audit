import "../../../lib/mongodb.js";
import Audit from "../../../models/Audit.js";
import { TOOLS } from "../../../lib/pricingData.js";
import Link from "next/link.js";

export async function generateMetadata({ params }) {
  const audit = await Audit.findOne({ auditId: params.id }).lean();
  if (!audit) return { title: "Audit not found" };

  return {
    title: `AI Spend Audit — Save $${audit.totalMonthlySavings.toFixed(0)}/mo`,
    description: `This team could save $${audit.totalMonthlySavings.toFixed(0)}/month on AI tools. See the full breakdown.`,
    openGraph: {
      title: `AI Spend Audit — Save $${audit.totalMonthlySavings.toFixed(0)}/mo`,
      description: `Potential annual savings: $${audit.totalAnnualSavings.toFixed(0)}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `AI Spend Audit — Save $${audit.totalMonthlySavings.toFixed(0)}/mo`,
    },
  };
}

export default async function ResultsPage({ params }) {
  const audit = await Audit.findOne({ auditId: params.id }).lean();

  if (!audit) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Audit not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            AI Spend Audit
          </h1>
          <p className="text-gray-500">
            Use case:{" "}
            <span className="capitalize font-medium">{audit.useCase}</span> ·
            Team size: <span className="font-medium">{audit.teamSize}</span>
          </p>
        </div>

        {/* Hero */}
        <div
          className={`rounded-2xl p-8 text-center mb-6 ${audit.totalMonthlySavings > 0 ? "bg-indigo-50" : "bg-green-50"}`}
        >
          {audit.totalMonthlySavings > 0 ? (
            <>
              <p className="text-sm text-indigo-500 uppercase tracking-wide mb-1">
                Potential Savings
              </p>
              <div className="text-5xl font-extrabold text-indigo-700">
                ${audit.totalMonthlySavings.toFixed(0)}
                <span className="text-2xl">/mo</span>
              </div>
              <div className="text-xl text-indigo-400 mt-1">
                ${audit.totalAnnualSavings.toFixed(0)}/year
              </div>
            </>
          ) : (
            <>
              <div className="text-4xl mb-2">✅</div>
              <h2 className="text-2xl font-bold text-green-800">
                Spending looks optimal
              </h2>
            </>
          )}
        </div>

        {/* Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 mb-6">
          <h2 className="font-semibold text-gray-800 text-lg">
            Tool Breakdown
          </h2>
          {audit.results.map((result, i) => (
            <div
              key={i}
              className={`rounded-xl border p-4 ${result.savings > 0 ? "border-orange-200 bg-orange-50" : "border-gray-100 bg-gray-50"}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">
                    {TOOLS[result.tool]?.name || result.tool}
                  </div>
                  <div className="text-xs text-gray-400 capitalize">
                    {result.plan} · {result.seats} seat(s)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    ${result.currentSpend}/mo
                  </div>
                  {result.savings > 0 && (
                    <div className="text-sm font-semibold text-orange-600">
                      Save ${result.savings.toFixed(0)}/mo
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {result.recommendation}
              </p>
            </div>
          ))}
        </div>

        {/* Summary */}
        {audit.summary && (
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
              AI Summary
            </p>
            <p className="text-gray-700 leading-relaxed">{audit.summary}</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center space-y-4">
          <Link
            href="/"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Audit your own stack →
          </Link>
          {audit.totalMonthlySavings > 500 && (
            <div>
              <Link
                href="https://credex.rocks"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-indigo-600 font-medium hover:underline"
              >
                Save even more with Credex discounted credits →
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
