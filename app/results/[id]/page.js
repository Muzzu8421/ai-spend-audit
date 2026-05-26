import Link from "next/link";
import connectDB from "../../../lib/mongodb.js";
import Audit from "../../../models/Audit.js";
import { TOOLS } from "../../../lib/pricingData.js";

export async function generateMetadata({ params }) {
  const { id } = await params;
  await connectDB();
  const audit = await Audit.findOne({ auditId: id }).lean();
  if (!audit) return { title: "Audit not found" };

  return {
    title: `AI Spend Audit — Save $${audit.totalMonthlySavings.toFixed(0)}/mo`,
    description: `This team could save $${audit.totalMonthlySavings.toFixed(0)}/month on AI tools.`,
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
  const { id } = await params;
  await connectDB();
  const audit = await Audit.findOne({ auditId: id }).lean();

  if (!audit) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Audit not found.</p>
          <Link
            href="/"
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Run your own audit →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="text-indigo-500 text-sm hover:underline">
            ← SpendScan
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-3 mb-2">
            AI Spend Audit
          </h1>
          <p className="text-gray-500">
            Use case:{" "}
            <span className="capitalize font-medium">{audit.useCase}</span>{" "}
            · Team size:{" "}
            <span className="font-medium">{audit.teamSize}</span>
          </p>
        </div>

        {/* Hero savings */}
        <div
          className={`rounded-2xl p-8 text-center mb-6 ${
            audit.totalMonthlySavings > 0 ? "bg-indigo-50" : "bg-green-50"
          }`}
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
              <p className="text-green-600 mt-1">
                Your AI stack is well matched to your usage.
              </p>
            </>
          )}
        </div>

        {/* Credex CTA for high savings */}
        {audit.totalMonthlySavings > 500 && (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white mb-6">
            <h3 className="font-bold text-xl mb-1">Save even more with Credex</h3>
            <p className="text-indigo-100 text-sm mb-4">
              Credex sells discounted AI credits — Cursor, Claude, ChatGPT
              Enterprise — sourced from companies that overforecast.
            </p>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-indigo-600 font-semibold px-5 py-2 rounded-lg hover:bg-indigo-50 transition-colors inline-block"
            >
              Book a free consultation →
            </a>
          </div>
        )}

        {/* Tool breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 mb-6">
          <h2 className="font-semibold text-gray-800 text-lg">
            Tool Breakdown
          </h2>
          {audit.results.map((result, i) => (
            <div
              key={i}
              className={`rounded-xl border p-4 ${
                result.savings > 0
                  ? "border-orange-200 bg-orange-50"
                  : "border-gray-100 bg-gray-50"
              }`}
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

        {/* AI Summary */}
        {audit.summary && (
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
              AI Summary
            </p>
            <p className="text-gray-700 leading-relaxed">{audit.summary}</p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center space-y-3">
          <Link
            href="/"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Audit your own stack →
          </Link>
          <p className="text-gray-400 text-sm">
            Free · No login required · Built by{" "}
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline"
            >
              Credex
            </a>
          </p>
        </div>

      </div>
    </main>
  );
}