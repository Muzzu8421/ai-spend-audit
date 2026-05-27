# REFLECTION.md

## Q1: The MongoDB SSL Error — How I Debugged It

The error appeared on Day 4: `MongoServerSelectionError: SSL routines:ssl3_read_bytes:tlsv1 alert internal error`. The error message itself was misleading — I initially thought it was a certificate validation problem — but the real issue was a missing configuration option.

**Hypotheses I tested (in order):**

1. **Wrong connection string format** — I checked the MongoDB Atlas dashboard, compared my `MONGODB_URI` to the provided template, verified the cluster name and credentials. Format was correct.

2. **IP not whitelisted** — Checked the IP Whitelist section in Atlas, saw my laptop IP was already allowed. Also tried adding 0.0.0.0/0 for testing. That wasn't it.

3. **Missing TLS options** — After reading MongoDB driver changelog and GitHub issues, I realized newer versions of the Node driver require *explicit* TLS configuration even when using `+srv` connection strings (which auto-enable TLS). The fix:

```javascript
// lib/mongodb.js — added these options
const options = {
  tls: true,
  tlsAllowInvalidCertificates: false,
  serverSelectionTimeoutMS: 5000
};
mongoose.connect(MONGODB_URI, options)
```

**Why this worked:** The `tls: true` flag forces explicit TLS negotiation, and `serverSelectionTimeoutMS` prevents hanging if the initial connection attempt fails. The error had been a silent timeout that the driver was reporting as an SSL error.

**What I learned:** Error messages from low-level libraries (SSL, TLS, socket) often point to a symptom, not the root cause. Next time, I'd check the driver's changelog first before diving into certificate debugging.

---

## Q2: A Decision I Reversed Mid-Week

On Day 2, I was deciding between **Supabase (PostgreSQL)** and **MongoDB** for the database. My initial instinct was Supabase because it's more familiar and has great DX (built-in Auth, RLS, realtime). I started sketching a schema:

```sql
-- Supabase approach
CREATE TABLE audits (
  id uuid PRIMARY KEY,
  email VARCHAR,
  ...
);
CREATE TABLE audit_entries (
  id uuid PRIMARY KEY,
  audit_id uuid REFERENCES audits(id),
  tool VARCHAR,
  plan VARCHAR,
  ...
);
CREATE TABLE audit_results (
  id uuid PRIMARY KEY,
  audit_id uuid REFERENCES audits(id),
  ...
);
```

But then I realized: **this audit structure is deeply nested and hierarchical**. Each audit is a single document with entries, results, and metadata all bundled. Normalizing it across three tables in Postgres would mean:
- N+3 queries to fetch a full audit (main audit, entries, results)
- Schema migrations if I want to change the results structure
- JOIN complexity for simple lookups

I switched to **MongoDB** specifically because the audit object naturally maps to a BSON document. Zero normalization needed. A single find-by-ID query returns the entire audit structure. If I need to change what fields are stored in results, I don't run a migration — new audits just have the new structure.

**Why this was the right call:** MongoDB's document model matched the problem domain perfectly. By Day 5, when I was building the results page and lead capture, I was grateful not to be juggling FK constraints. Postgres would've been fine for 100 audits/week, but this decision scales better.

---

## Q3: What I'd Build in Week 2

**Priority 1: User Feedback Loop** (2 days)
- Add a "Was this helpful?" button on results pages that collects free-text feedback
- Hook it to the Lead model so I can email follow-ups to users who say "no"
- Track which audit recommendations users actually implement (via a second email survey in week 3)

**Priority 2: Expand Pricing Coverage** (2 days)
- Add 5 more tools: Perplexity Pro, Mistral API, xAI Grok, Replit, Cursor + extensions marketplace
- Research team plan discounts (e.g., "Claude Team becomes cheaper per seat at 5+ users")
- Add historical pricing so I can flag if a user is on a recently outdated plan

**Priority 3: Credex Integration** (2 days)
- For leads with >$500/mo savings, add a secondary CTA: "Credex can source you credits at 30% off list price"
- Integrate Credex API to pull real-time discount rates and auto-fill them in audit summaries
- Track which leads convert to Credex customers (success metric)

**Priority 4: A/B Test the Lead Form** (1.5 days)
- Currently asking: email, company, role
- Test versions: (1) email only, (2) email + company name + team size, (3) email + company + conversion intent ("How many people on your team use these tools?")
- Measure conversion rate and lead quality for each

**Priority 5: Competitor Research Page** (1.5 days)
- Add a /comparator endpoint that takes two tools and shows side-by-side pricing at different team sizes
- This becomes SEO content ("Claude vs ChatGPT pricing", "Cursor vs GitHub Copilot for engineering teams")

**Rationale:** Week 1 was product-market fit validation (does the audit reveal real savings?). Week 2 is about the flywheel: feedback → better recommendations → more conversions → better Credex attribution.

---

## Q4: How I Used AI Tools

**Claude (via Anthropic API in the product):**
- **Trusted with:** Generating the audit summary paragraph for each result. Claude reads the context (team size, tools, use case, savings) and writes a personalized 80-100 word summary that mentions specific tools and recommends a next step. This requires instruction-following, not just factual recall.
- **Did not trust with:** Calculating the actual savings and recommendations. These are deterministic financial calculations that need to be 100% auditable. If Claude generated the recommendation logic, I couldn't explain to a CFO why they should switch plans — I'd be saying "the AI told me so."
- **Fallback:** When the Anthropic API fails (network issue, rate limit, missing key), the product doesn't break. A templated summary takes over. This decision (fallback > hard dependency) was crucial.

**Claude (in development, via Claude Code):**
- **Trusted with:** Scaffolding the Next.js project structure, component boilerplate, form state management patterns. These are well-established conventions.
- **Did not trust with:** The audit engine logic. I wrote it by hand from first principles because each rule (wrong plan, cheaper alternative, etc.) needed to be defensible. Auditing spend is a financial activity; AI-generated logic here felt reckless.
- **One time it was wrong:** When building the results page Open Graph meta tags, Claude suggested using relative URLs in the og:image field. This doesn't work — social crawlers need absolute URLs. Caught it during Vercel testing when the link preview was blank on Twitter.

**Overall:** I treated Claude as a co-pilot for boilerplate and a service for personalization, but the business logic stayed in my hands. This is the right balance for a fintech-adjacent product.

---

## Q5: Self-Rating (Discipline, Code Quality, Design Sense, Problem-Solving, Entrepreneurial Thinking)

### Discipline: 8/10
I stuck to the MVP scope rigorously and shipped on time. The DEVLOG is honest about time spent and blockers. However, on Day 4, I spent 5 hours debugging the MongoDB SSL issue when I could've saved time by reading the driver docs first — a lack of discipline in root-cause analysis upfront.

### Code Quality: 7/10
The code is readable and modular (auditEngine, pricingData, components are cleanly separated). I avoided early abstractions. But I didn't write tests during development, which means I caught bugs by manually clicking through the UI instead of automated testing. Also, the rate limiter uses an in-memory Map that doesn't persist across server restarts — not production-ready.

### Design Sense: 8/10
The UI is clean, the color scheme (indigo + white) is professional, and the layout hierarchy makes it clear what to do next (form → results → share/email). The Credex CTA conditionally shows only for high-savings audits (no spam). The one weakness: the tool-selection dropdowns could be a visual selector (like stripe.com's pricing plan selector) instead of plain `<select>` tags.

### Problem-Solving: 8/10
Debugging the MongoDB SSL error was methodical (hypothesis testing, checking each assumption). Reversing the Supabase→MongoDB decision midweek showed I can course-correct based on new information. But I took a brute-force approach to the SSL issue (add every TLS option and see what sticks) instead of a more principled investigation.

### Entrepreneurial Thinking: 9/10
I researched Credex's business model and positioning before writing code, so the product solves a real lead-gen problem. I set up the results page to be highly shareable (Open Graph tags, unique URLs), which is a growth lever. I thought about unit economics (cost to acquire a lead, cost to send an email) and designed for it. The one miss: I didn't validate the GTM strategy with actual potential Credex customers before building.

