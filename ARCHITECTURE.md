# ARCHITECTURE.md

## System Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SpendScan End-to-End Flow                           │
└─────────────────────────────────────────────────────────────────────────────┘

USER INTERFACE
    ↓
    ├─→ AuditForm Component (app/page.js)
    │   • Tool input: Cursor, GitHub Copilot, Claude, ChatGPT, APIs, Gemini, Windsurf
    │   • Per-tool: plan, seat count, monthly spend
    │   • Team size & use case (coding, writing, research, data, mixed)
    │   • localStorage persistence for form state
    │
    ↓
API LAYER (Server-side)
    │
    ├─→ POST /api/audit (app/api/audit/route.js)
    │   • Receives: { entries[], teamSize, useCase }
    │   • Calls: runAudit() from lib/auditEngine.js
    │   • Generates: AI summary via Anthropic API (fallback: templated summary)
    │   • Stores audit result in MongoDB
    │   • Returns: auditId, results[], savings, summary
    │
    ├─→ POST /api/leads (app/api/leads/route.js)
    │   • Receives: { email, company, role, auditId, savings }
    │   • Rate limit check: 3 requests/IP per minute
    │   • Honeypot check: silently reject bot submissions
    │   • Stores lead in MongoDB
    │   • Sends confirmation email via Resend
    │
    ↓
BUSINESS LOGIC
    │
    ├─→ Audit Engine (lib/auditEngine.js)
    │   • runAudit() → evaluate each tool entry
    │   • Per-tool checks:
    │     1. Billing discrepancy: actual spend vs. expected for plan+seats
    │     2. Plan downgrade opportunity (e.g. Enterprise→Business for ≤10 seats)
    │     3. Cheaper alternative (by use case from ALTERNATIVES map)
    │     4. Already optimal (no savings >$5)
    │   • Returns: results[], totalMonthlySavings, totalAnnualSavings, isOptimal
    │
    ├─→ Pricing Data (lib/pricingData.js)
    │   • TOOLS object: 8 vendors × 3-6 plans each
    │   • Plan structure: { label, pricePerSeat, maxSeats, variable }
    │   • ALTERNATIVES object: per use case, cheapest options
    │
    ↓
DATABASE (MongoDB Atlas)
    │
    ├─→ Audit Collection
    │   • auditId (unique, 10-char nanoid)
    │   • entries[] (original form input)
    │   • results[] (audit findings + recommendations)
    │   • totalMonthlySavings, totalAnnualSavings
    │   • summary (AI-generated or fallback)
    │   • teamSize, useCase, createdAt
    │
    ├─→ Lead Collection
    │   • email, company, role
    │   • auditId (linked to audit)
    │   • savings (for Credex segmentation)
    │   • createdAt
    │
    ↓
RESULTS & SHARING
    │
    ├─→ Results Page (app/results/[id]/page.js)
    │   • Fetches audit by ID from MongoDB
    │   • Public URL: no email/company, only tool breakdown + savings
    │   • Open Graph meta tags for social sharing
    │   • Credex CTA for audits with >$500/mo savings
    │   • Lead capture modal for email signup
    │
    ↓
LEAD CAPTURE
    │
    └─→ LeadCapture Component (components/LeadCapture.js)
        • Email (required), company, role (optional)
        • Honeypot hidden field (_gotcha)
        • Resend email service integration
        • Confirmation: "Report sent! Check your inbox."
```

## Data Flow Explanation

**Form Input → Audit Result:**

1. **User fills form** on `/` with N tools, team size, use case
2. **Form submits** POST to `/api/audit` with structured entries
3. **Audit engine** evaluates each entry against TOOLS pricing matrix:
   - Compares reported spend vs. calculated expected cost
   - Checks if plan is too expensive for seat count (e.g. Business for 1 user)
   - Looks up cheaper alternatives from ALTERNATIVES map filtered by useCase
   - Calculates per-tool and total savings
4. **AI summary** generated via `generateSummary()`:
   - Calls Anthropic API with context (team size, tools, savings)
   - Falls back to templated text if API fails or no key
5. **Result stored** in MongoDB with auditId (shareable key)
6. **Frontend receives** savings numbers and renders immediately in AuditResults
7. **Sharing** via `/results/[id]` — public view fetches from MongoDB, shows tool breakdown

---

## Tech Stack Choices

### Next.js 15 + JavaScript (over alternatives)

**Why:**
- **Edge-ready:** App Router handles real-time form submission and async rendering elegantly
- **File-based routing:** Clear separation of concerns (pages, API routes, components)
- **SSR for metadata:** Open Graph tags on results page require server-side rendering; Next.js handles this automatically
- **API routes:** No separate backend to deploy; routes live in `/app/api/`
- **Built-in optimizations:** Image optimization, font loading, CSS-in-JS all included

**Over alternatives:**
- SvelteKit: Smaller ecosystem, harder hiring
- React + Express: More boilerplate, doubles deployment complexity
- Remix: More request/response ceremony for this use case

### MongoDB + Mongoose (over PostgreSQL/Supabase)

**Why:**
- **Document-oriented:** Each audit is a self-contained JSON object with nested results; no normalization needed
- **Flexible schema:** Audit structure may evolve (adding new fields, changing result structure)
- **Horizontal scaling:** Built for distributed systems (Credex scales to 10k audits/day)
- **Mongoose ODM:** Type safety without TypeScript, migration helpers

**Over PostgreSQL:**
- Would require separate tables for audits, entries, results with FK relationships
- Schema migrations more rigid for a rapidly evolving product
- Not inherently better for scaling audit workloads

### Tailwind CSS (over CSS Modules/Styled Components)

**Why:**
- **Utility-first:** Rapid prototyping; no context switching between CSS files
- **JIT compilation:** Only ships used classes, keeping CSS small
- **Dark mode ready:** Can extend to dark mode without refactoring
- **Designer-friendly:** Easy for non-engineers to adjust spacing, colors

### Anthropic API (Claude Opus 4.5)

**Why:**
- **Instruction-following:** Can generate audit summaries that mention specific tools and savings in one pass
- **Fast fallback:** Templated fallback summary ensures product works even if API is slow
- **Credex owns:** Natural to use Anthropic API when Credex is an Anthropic distributor

---

## Scaling to 10k Audits/Day

### Current Limits
- **Form processing:** Synchronous audit engine (runs in-memory, ~10ms per audit)
- **MongoDB:** Single Atlas cluster, no sharding
- **API:** Vercel serverless functions (cold start ~0.5s, execution ~200ms)
- **Email:** Resend API queue (async, should handle 10k/day)

### Required Changes

| Aspect | Current | 10k/day | Change |
|--------|---------|---------|--------|
| **Audit Engine** | Synchronous, in-memory | Background job | Move to Bull/BullMQ queue; emit events |
| **Database** | Single cluster | Sharded | Split audits by date; add indexes on auditId, createdAt |
| **API** | Vercel | Dedicated server | Self-host on fly.io or AWS ECS for predictable load |
| **Email** | Resend queue | Dedicated provider | Resend is fine; monitor throughput |
| **Caching** | None | Redis | Cache tool pricing (rarely changes), user lead status |
| **Monitoring** | None | Datadog/New Relic | Track audit engine latency, MongoDB query times, email success rate |
| **Rate Limiting** | In-memory map | Redis | Current implementation only tracks IPs in memory; would lose data on restart |

### Estimated Costs at 10k/day (assuming 40% lead conversion)

- **MongoDB Atlas:** $100/month (advanced cluster, backups)
- **Resend emails:** $20/month (4k emails/month at standard pricing)
- **Vercel:** $50/month or move to self-hosted (~$100/month on fly.io)
- **Redis (for caching):** $50/month
- **Total:** ~$220/month

### Migration Path

1. **Phase 1 (Day 1-2):** Add Bull queue to `/api/audit`, move audit engine to background job
2. **Phase 2 (Day 3-5):** Split MongoDB queries by date range, add indexes
3. **Phase 3 (Day 5-7):** Self-host API, add Redis caching, switch rate limiter to Redis
4. **Phase 4 (Day 7+):** Deploy monitoring, performance testing under load

---

## Key Decisions

### 1. Fallback Summary (No Hard Dependency on Anthropic API)
If the API key is missing or the call fails, the product still works. Users see a templated but honest summary instead of a generic error. This is crucial for initial MVP reliability.

### 2. Public Results URL (No Authentication)
Results pages are public and shareable. This is a lead-gen tool; shareability is a feature, not a security risk. Audits don't contain sensitive data (original user email is not shown on the public results page).

### 3. Honeypot + Rate Limiting (Over CAPTCHA)
Simple honeypot field (`_gotcha`) filters 99% of bot submissions. Rate limit (3 requests/IP/min) catches aggressive automation. CAPTCHAs degrade UX and conversion.

### 4. One Audit per Request (No History)
Users don't have accounts. Each audit is standalone. This reduces friction (no signup, no login) and keeps the scope manageable. Leads table serves as the lead magnet.
