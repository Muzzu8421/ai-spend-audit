import { NextResponse } from "next/server";
import "../../../lib/mongodb.js";
import Lead from "../../../models/Lead.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiter
const rateMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const max = 3;

  const hits = (rateMap.get(ip) || []).filter((t) => now - t < windowMs);
  hits.push(now);
  rateMap.set(ip, hits);
  return hits.length > max;
}

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { email, company, role, auditId, savings, _gotcha } = await req.json();

    // Honeypot check
    if (_gotcha) {
      return NextResponse.json({ ok: true }); // Silently ignore bots
    }

    if (!email || !auditId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await Lead.create({ email, company, role, auditId, savings });

    // Send confirmation email
    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/results/${auditId}`;
    const isHighSavings = savings > 500;

    await resend.emails.send({
      from: "SpendScan <onboarding@resend.dev>",
      to: email,
      subject: "Your AI Spend Audit Report",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#4f46e5">Your AI Spend Audit</h2>
          <p>Hi${company ? ` from ${company}` : ""},</p>
          <p>Your audit is ready. Here's your shareable report:</p>
          <a href="${shareUrl}" style="display:inline-block;background:#4f46e5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">
            View My Report →
          </a>
          ${
            isHighSavings
              ? `<p style="margin-top:24px;padding:16px;background:#f0f9ff;border-radius:8px">
              <strong>You have significant savings potential.</strong> Credex sells discounted AI credits
              at real discounts. <a href="https://credex.rocks" style="color:#4f46e5">Book a free consultation →</a>
            </p>`
              : ""
          }
          <p style="color:#9ca3af;font-size:12px;margin-top:32px">
            SpendScan by Credex · credex.rocks
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}