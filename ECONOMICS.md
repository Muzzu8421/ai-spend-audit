# ECONOMICS.md — Unit Economics

## What a Converted Lead Is Worth to Credex

Credex sells discounted AI infrastructure credits. Based on publicly available information about the AI credits market:

- Average deal size (discounted credits purchase): **$5,000–$20,000**
- Credex margin on credits: estimated **15–25%** (buying at steep discount, selling at moderate discount vs. retail)
- Gross profit per deal: **$750–$5,000**
- Conservative estimate used below: **$1,500 gross profit per closed deal**

**Reasoning:** A startup spending $500/month on AI tools spends $6,000/year. If Credex can offer those credits at 20–30% discount, the buyer saves $1,200–$1,800/year. Credex captures margin on volume. A buyer who purchases $10k in Cursor/Claude credits at 20% discount saves $2,000; Credex earns ~$1,500 on the deal.

---

## CAC by Channel

| Channel | Est. Visitors | Audit Completion Rate | Lead Capture Rate | Consultation Rate | Deals Closed | CAC |
|---------|--------------|----------------------|-------------------|-------------------|--------------|-----|
| HN Show HN | 400 | 15% (60 audits) | 30% (18 leads) | 15% (3 consults) | 1 | $0 |
| r/startups post | 200 | 12% (24 audits) | 25% (6 leads) | 10% (0.6 consults) | 0.2 | $0 |
| Cold X DMs (20) | 20 | 40% (8 audits) | 50% (4 leads) | 25% (1 consult) | 0.3 | $0 |
| Credex warm list (50) | 50 | 60% (30 audits) | 50% (15 leads) | 30% (5 consults) | 1.5 | $0 |
| Product Hunt | 500 | 10% (50 audits) | 20% (10 leads) | 10% (1 consult) | 0.3 | $0 |

**All channels are $0 CAC in the first 30 days** because the entire GTM is organic distribution. The tool itself is the acquisition cost (engineering time, ~$0 in infrastructure at this scale).

At modest paid scale (e.g. sponsoring a dev newsletter at $500/issue):
- Newsletter reach: 20,000 readers
- CTR: 2% = 400 clicks
- Audit completion: 15% = 60 audits
- Lead capture: 30% = 18 leads
- Consultation: 15% = 3 consultations
- Deals closed: 1
- **Paid CAC: $500 per deal vs. $1,500 gross profit = profitable**

---

## Conversion Funnel Math

```
Visitors → Audit Started → Audit Completed → Lead Captured → Consultation Booked → Deal Closed

100        →    40%         →      60%        →     30%        →       15%          →    33%
100        →    40          →      24          →     7.2        →       1.1          →    0.36
```

**To get 1 closed deal: need ~280 visitors**

At $1,500 gross profit per deal:
- Break-even CAC: $1,500
- If each visitor costs $0 (organic): infinite ROI
- If each visitor costs $0.50 (paid): $140 CAC vs. $1,500 LTV = 10x ROAS

---

## What Conversion Rates Make This Profitable

The tool is profitable at $0 CAC from day 1 (organic only). For paid channels to be profitable:

| Metric | Minimum Required |
|--------|-----------------|
| Audit completion rate | ≥ 10% of landing page visitors |
| Lead capture rate | ≥ 20% of audits completed |
| Consultation booking rate | ≥ 10% of leads |
| Deal close rate | ≥ 25% of consultations |
| Average deal value | ≥ $3,000 gross profit |

At these minimums with $500 newsletter spend:
- 400 visitors × 10% × 20% × 10% × 25% = 0.02 deals
- 0.02 × $3,000 = $60 gross profit per $500 spend
- **Not profitable at minimum rates with paid channels**

**Conclusion:** Paid acquisition only works with higher funnel performance OR higher deal sizes. Organic remains the primary channel until the product proves 20%+ lead capture and 15%+ consultation rates.

---

## What Would Have to Be True for $1M ARR in 18 Months

**$1M ARR = $83,333 gross profit/month**

At $1,500 gross profit per deal: **55 deals/month needed**

**Path A: High volume, low deal size**
- 55 deals/month × $1,500 = $82,500/month
- Requires: ~15,000 audit completions/month (at 0.36% visitor-to-deal rate)
- Requires: ~37,500 unique visitors/month
- Achievable via: SEO content ("Claude vs ChatGPT pricing 2026"), Product Hunt featured, newsletter partnerships

**Path B: Low volume, high deal size**
- 15 deals/month × $5,500 = $82,500/month
- Target enterprise: teams spending $5k+/month on AI tools
- Requires: Outbound sales motion, Credex warm network, account-based marketing
- More realistic given Credex's existing deal flow

**What has to be true:**

1. **Product:** Audit results are trusted enough that high-savings users book a consultation (requires defensible pricing data, no fake savings)
2. **Sales:** Credex has a repeatable consultation-to-close motion (30%+ close rate)
3. **Distribution:** Either 37k visitors/month via SEO/virality, OR 15 high-value enterprise leads/month via outbound
4. **Retention:** Credex captures repeat buyers (teams buy credits quarterly, not once)
5. **Timing:** AI tool spending continues growing (extremely likely given market trends)

**Most likely path to $1M ARR:** Enterprise outbound (Path B) + organic tool virality as top-of-funnel. The tool's shareable URLs become the viral loop; Credex sales team closes the high-value accounts.

---

## Rough 18-Month P&L Projection

| Month | Audits | Leads | Deals | Gross Profit | Infra Cost | Net |
|-------|--------|-------|-------|--------------|------------|-----|
| 1–2 | 200 | 60 | 5 | $7,500 | $50 | $7,450 |
| 3–4 | 500 | 150 | 12 | $18,000 | $100 | $17,900 |
| 5–6 | 1,000 | 300 | 25 | $37,500 | $200 | $37,300 |
| 7–9 | 2,500 | 750 | 40 | $60,000 | $400 | $59,600 |
| 10–12 | 5,000 | 1,500 | 55 | $82,500 | $700 | $81,800 |
| 13–18 | 8,000+ | 2,400+ | 55+ | $82,500+ | $1,000 | $81,500+ |

**Infrastructure cost stays low** (MongoDB + Vercel + Resend ≈ $200–1,000/month even at scale) because the compute is minimal — audit engine is simple math, not ML inference.

**Key assumption:** Deal size grows over time as Credex builds reputation and targets larger teams. Month 1 deals average $1,500; Month 12 deals average $3,000+ as enterprise clients engage.