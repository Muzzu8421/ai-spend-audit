/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";
import { TOOLS } from "@/lib/tools";

const DEFAULT_ENTRY = { tool: "cursor", plan: "pro", seats: 1, monthlySpend: "" };

const USE_CASES = [
  { value: "coding",   label: "Coding / Engineering" },
  { value: "writing",  label: "Writing / Content" },
  { value: "research", label: "Research / Analysis" },
  { value: "data",     label: "Data / Analytics" },
  { value: "mixed",    label: "Mixed / General" },
];

export default function AuditForm({ onSubmit }) {
  const [entries, setEntries] = useState([{ ...DEFAULT_ENTRY }]);
  const [teamSize, setTeamSize] = useState(1);
  const [useCase, setUseCase] = useState("coding");
  const [loading, setLoading] = useState(false);

  // Persist form state
  useEffect(() => {
    const saved = localStorage.getItem("auditForm");
    if (saved) {
      const parsed = JSON.parse(saved);
      setEntries(parsed.entries || [{ ...DEFAULT_ENTRY }]);
      setTeamSize(parsed.teamSize || 1);
      setUseCase(parsed.useCase || "coding");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("auditForm", JSON.stringify({ entries, teamSize, useCase }));
  }, [entries, teamSize, useCase]);

  function updateEntry(index, field, value) {
    setEntries((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      // Reset plan when tool changes
      if (field === "tool") {
        const firstPlan = Object.keys(TOOLS[value].plans)[0];
        updated[index].plan = firstPlan;
      }
      return updated;
    });
  }

  function addTool() {
    setEntries((prev) => [...prev, { ...DEFAULT_ENTRY }]);
  }

  function removeTool(index) {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const cleaned = entries.map((en) => ({
      ...en,
      seats: parseInt(en.seats) || 1,
      monthlySpend: parseFloat(en.monthlySpend) || 0,
    }));
    await onSubmit({ entries: cleaned, teamSize: parseInt(teamSize), useCase });
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Team Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Team Size
          </label>
          <input
            type="number"
            min="1"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Primary Use Case
          </label>
          <select
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          >
            {USE_CASES.map((uc) => (
              <option key={uc.value} value={uc.value}>{uc.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tool Entries */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Your AI Tools</h3>
        {entries.map((entry, index) => (
          <ToolRow
            key={index}
            entry={entry}
            index={index}
            onChange={updateEntry}
            onRemove={() => removeTool(index)}
            canRemove={entries.length > 1}
          />
        ))}
      </div>

      {/* Add Tool */}
      <button
        type="button"
        onClick={addTool}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-500 hover:border-indigo-400 hover:text-indigo-500 transition-colors"
      >
        + Add Another Tool
      </button>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
      >
        {loading ? "Auditing..." : "Run My Free Audit →"}
      </button>
    </form>
  );
}

function ToolRow({ entry, index, onChange, onRemove, canRemove }) {
  const toolKeys = Object.keys(TOOLS);
  const currentTool = TOOLS[entry.tool];
  const planKeys = Object.keys(currentTool.plans);

  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Tool {index + 1}</span>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-400 hover:text-red-600 text-sm"
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Tool */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Tool</label>
          <select
            value={entry.tool}
            onChange={(e) => onChange(index, "tool", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          >
            {toolKeys.map((key) => (
              <option key={key} value={key}>{TOOLS[key].name}</option>
            ))}
          </select>
        </div>

        {/* Plan */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Plan</label>
          <select
            value={entry.plan}
            onChange={(e) => onChange(index, "plan", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          >
            {planKeys.map((key) => (
              <option key={key} value={key}>
                {currentTool.plans[key].label}
              </option>
            ))}
          </select>
        </div>

        {/* Seats */}
        <div>
          <label className="block text-xs text-gray-900 mb-1">Seats / Users</label>
          <input
            type="number"
            min="1"
            value={entry.seats}
            onChange={(e) => onChange(index, "seats", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
        </div>

        {/* Spend */}
        <div>
          <label className="block text-xs text-gray-900 mb-1">Monthly Spend ($)</label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 40"
            value={entry.monthlySpend}
            onChange={(e) => onChange(index, "monthlySpend", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
        </div>
      </div>
    </div>
  );
}