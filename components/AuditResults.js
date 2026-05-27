"use client";
import { useState } from "react";
import LeadCapture from "./LeadCapture.js";
import { TOOLS } from "@/lib/tools.js";

export default function AuditResults({ audit, auditId }) {
  const [showLead, setShowLead] = useState(false);
  const [leadDone, setLeadDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    results,
    totalMonthlySavings,
    totalAnnualSavings,
    isOptimal,
    summary,
  } = audit;
  const highSavings = totalMonthlySavings > 500;
  const shareUrl = `${window.location.origin}/results/${auditId}`;

  function copyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-8">
      {/* Hero savings */}
      <div
        className={`rounded-2xl p-8 text-center ${isOptimal ? "bg-green-50" : "bg-indigo-50"}`}
      >
        {isOptimal ? (
          <>
            <div className="text-4xl mb-2">✅</div>
            <h2 className="text-2xl font-bold text-green-800">
              You&apos;re spending well
            </h2>
            <p className="text-green-600 mt-1">
              Your AI stack looks optimised for your usage.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-indigo-500 uppercase tracking-wide mb-1">
              Potential Savings
            </p>
            <div className="text-5xl font-extrabold text-indigo-700">
              ${totalMonthlySavings.toFixed(0)}
              <span className="text-2xl">/mo</span>
            </div>
            <div className="text-xl text-indigo-500 mt-1">
              ${totalAnnualSavings.toFixed(0)} saved per year
            </div>
          </>
        )}
      </div>

      {/* Credex CTA for high savings */}
      {highSavings && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
          <h3 className="font-bold text-xl mb-1">Save even more with Credex</h3>
          <p className="text-indigo-100 text-sm mb-4">
            Credex sells discounted AI credits — Cursor, Claude, ChatGPT
            Enterprise — sourced from companies that overforecast. Real
            discounts, same product.
          </p>
          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-indigo-600 font-semibold px-5 py-2 rounded-lg hover:bg-indigo-50 transition-colors inline-block"
          >
            Book a free Credex consultation →
          </a>
        </div>
      )}

      {/* Per-tool breakdown */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800 text-lg">
          Tool-by-tool breakdown
        </h3>
        {results.map((result, i) => (
          <ToolResult key={i} result={result} />
        ))}
      </div>

      {/* AI Summary */}
      {summary && (
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
            AI Summary
          </p>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Share + Lead capture */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={copyLink}
          className="border border-gray-300 rounded-xl py-3 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
        >
          {copied ? "Copied! ✓" : "🔗 Copy share link"}
        </button>
        {!leadDone && (
          <button
            onClick={() => setShowLead(true)}
            className="bg-indigo-600 text-white rounded-xl py-3 font-medium hover:bg-indigo-700 transition-colors"
          >
            📧 Email me this report
          </button>
        )}
      </div>

      {showLead && !leadDone && (
        <LeadCapture
          auditId={auditId}
          savings={totalMonthlySavings}
          onDone={() => {
            setLeadDone(true);
            setShowLead(false);
          }}
        />
      )}

      {leadDone && (
        <div className="text-center text-green-600 font-medium py-2">
          Report sent! Check your inbox.
        </div>
      )}

      {/* Optimal lead */}
      {isOptimal && !leadDone && (
        <div className="border border-gray-200 rounded-xl p-5 text-center">
          <p className="text-gray-600 text-sm mb-3">
            Want to be notified when new optimisations apply to your stack?
          </p>
          <button
            onClick={() => setShowLead(true)}
            className="bg-indigo-600 text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-indigo-700"
          >
            Notify me
          </button>
        </div>
      )}
    </div>
  );
}

function ToolResult({ result }) {
  const toolName = TOOLS[result.tool]?.name || result.tool;
  const hasSavings = result.savings > 0;

  return (
    <div
      className={`rounded-xl border p-4 ${hasSavings ? "border-orange-200 bg-orange-50" : "border-gray-200 bg-white"}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium text-gray-900">{toolName}</div>
          <div className="text-xs text-gray-500 mt-0.5 capitalize">
            {result.plan} · {result.seats} seat(s)
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">${result.currentSpend}/mo</div>
          {hasSavings && (
            <div className="text-sm font-semibold text-orange-600">
              Save ${result.savings.toFixed(0)}/mo
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2">{result.recommendation}</p>
    </div>
  );
}
