# METRICS.md

## North Star Metric

**Qualified leads generated per week** — defined as email captures from audits showing ≥$100/month in potential savings.

**Why this and not something else:**

- "Audits completed" is vanity — a user who completes an audit showing $0 savings and never returns adds no business value
- "Visitors" is even more vanity — traffic without conversion is noise
- "Deals closed" is too lagging — happens weeks after the audit; can't optimize on a 30-day lag
- "Emails captured" is close but too broad — an email from someone already spending optimally is a cold lead with low conversion potential

Qualified leads (≥$100/month savings) are the users most likely to book a Credex consultation. This metric is leading (happens same session as audit), actionable (can be improved by improving audit quality and form completion), and aligned with Credex's revenue model.

**Target at 30 days:** 25 qualified leads/week

---

## 3 Input Metrics That Drive the North Star

### 1. Audit Completion Rate
**Definition:** % of users who start the form and submit it (reach the results page)
**Target:** ≥ 40%
**Why it matters:** If users drop off mid-form, they never see savings, never convert to leads. A 10% improvement here compounds through the entire funnel.
**How to improve:** Shorten the form, add progress indicator, show a "preview savings" teaser mid-form

### 2. High-Savings Audit Rate
**Definition:** % of completed audits that show ≥$100/month in savings
**Target:** ≥ 35%
**Why it matters:** The tool can only generate qualified leads if the audit engine surfaces real savings. If too many audits return $0, either the pricing data is wrong, the user base is already optimized, or the audit logic is too conservative.
**How to improve:** Improve pricing data accuracy, tighten the alternative-tool recommendation logic, add more cross-tool comparisons

### 3. Lead Capture Rate (from high-savings audits)
**Definition:** % of users who saw ≥$100/month in savings and submitted their email
**Target:** ≥ 30%
**Why it matters:** This is the value exchange — we showed them something useful, they give us their email. If this is low, either the results page isn't compelling enough, the email form is too intrusive, or users don't trust the savings number.
**How to improve:** Add social proof on results page, improve copy on email gate, make the "get your report emailed" CTA more prominent

---

## What We'd Instrument First

In order of priority:

1. **Funnel drop-off points** — where do users leave the form? After tool 1? After tool 3? Before submitting? (Google Analytics events or Posthog)

2. **Savings distribution** — histogram of savings amounts across all audits. If 80% of audits show $0 savings, the engine has a calibration problem.

3. **Lead capture conversion by savings bucket** — do users with $500+/month savings convert at higher rates than $100–499/month? (Probably yes — confirms the Credex CTA threshold)

4. **Shareable URL click-through rate** — are the shared audit URLs actually being opened? If not, the viral loop isn't working.

5. **Email open rate on confirmation emails** — do users actually read the report we send? This predicts consultation booking intent.

---

## What Number Triggers a Pivot Decision

**If after 4 weeks:**

| Metric | Threshold | Pivot |
|--------|-----------|-------|
| Audit completion rate | < 20% | Form is too long/confusing — cut to 3 tools max, redesign UX |
| High-savings audit rate | < 15% | Pricing data wrong or engine too conservative — manual audit of 20 results to diagnose |
| Lead capture rate | < 10% | Trust problem — add social proof, remove optional fields, test email-only gate |
| Qualified leads/week | < 5 after week 3 | Distribution problem — not enough top-of-funnel; escalate GTM efforts |
| Consultation booking rate | < 5% of leads | Sales problem — Credex follow-up timing or messaging needs rework |

**The single most important pivot trigger:** If qualified leads/week is under 5 after 3 weeks of active distribution, the product is not working as a lead-gen asset. At that point, evaluate whether the audit logic is surfacing real savings (engine problem) or whether the wrong audience is using it (distribution problem). These require different fixes.

---

## Metrics Anti-Patterns to Avoid

- **DAU/MAU** — wrong for a tool people use once a quarter (when they review their SaaS spend). Recurring usage is not the model.
- **Time on site** — longer sessions might mean the form is confusing, not engaging
- **Page views** — vanity metric; one user refreshing the results page 10 times is not 10 users
- **NPS immediately post-audit** — too early; user hasn't acted on the recommendation yet. Survey 2 weeks later instead.