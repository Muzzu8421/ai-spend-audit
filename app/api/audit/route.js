import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import connectDB from "../../../lib/mongodb.js";
import Audit from "../../../models/Audit.js";
import { runAudit } from "../../../lib/auditEngine.js";

export async function POST(req) {
  try {
    await connectDB();
    const { entries, teamSize, useCase } = await req.json();

    // Run audit engine
    const { results, totalMonthlySavings, totalAnnualSavings, isOptimal } =
      runAudit(entries, teamSize, useCase);

    // Generate AI summary
    const summary = await generateSummary({
      results,
      totalMonthlySavings,
      totalAnnualSavings,
      teamSize,
      useCase,
      isOptimal,
    });

    const auditId = nanoid(10);

    await Audit.create({
      auditId,
      entries,
      teamSize,
      useCase,
      results,
      totalMonthlySavings,
      totalAnnualSavings,
      summary,
    });

    return NextResponse.json({
      auditId,
      results,
      totalMonthlySavings,
      totalAnnualSavings,
      isOptimal,
      summary,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Audit failed" }, { status: 500 });
  }
}

async function generateSummary(data) {
  try {
    const { results, totalMonthlySavings, teamSize, useCase, isOptimal } = data;

    const toolList = results
      .map((r) => `${r.tool} (${r.plan}, $${r.currentSpend}/mo)`)
      .join(", ");

    const prompt = `You are a concise AI spend advisor. Write a 80-100 word personalized audit summary for a team.

Context:
- Team size: ${teamSize}
- Primary use case: ${useCase}
- Tools: ${toolList}
- Total potential monthly savings: $${totalMonthlySavings.toFixed(0)}
- Already optimal: ${isOptimal}

Write a direct, friendly paragraph. No bullet points. Mention specific tools and savings. If optimal, say so honestly. End with one actionable next step.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const aiData = await res.json();
    return aiData.content?.[0]?.text || fallbackSummary(data);
  } catch {
    return fallbackSummary(data);
  }
}

function fallbackSummary({ teamSize, useCase, totalMonthlySavings, isOptimal }) {
  if (isOptimal) {
    return `Your team of ${teamSize} is spending efficiently on AI tools for ${useCase}. All plans are well-matched to your usage. Keep monitoring your API costs monthly and reassess if your team grows or use cases shift.`;
  }
  return `Your team of ${teamSize} is currently overspending on AI tools for ${useCase}. Based on your current plans and seat counts, you could save $${totalMonthlySavings.toFixed(0)}/month by switching plans or tools. Review the recommendations above and start with the highest-savings change first.`;
}