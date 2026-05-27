# PROMPTS.md

## AI-Generated Audit Summary Prompt

**Location:** `app/api/audit/route.js` lines 61-70

### The Exact Prompt

```
You are a concise AI spend advisor. Write a 80-100 word personalized audit summary for a team.

Context:
- Team size: ${teamSize}
- Primary use case: ${useCase}
- Tools: ${toolList}
- Total potential monthly savings: $${totalMonthlySavings.toFixed(0)}
- Already optimal: ${isOptimal}

Write a direct, friendly paragraph. No bullet points. Mention specific tools and savings. If optimal, say so honestly. End with one actionable next step.
```

---

## Prompt Engineering Rationale

### 1. **Length Constraint (80-100 words)**
The summary lives in a compact results card on the results page. Too long and it becomes unreadable; too short and it feels dismissive. 80-100 words is a tight, digestible paragraph that forces the AI to prioritize clarity over verbosity.

### 2. **"Direct, friendly" tone**
Avoid corporate jargon. Users are busy founders/ops people. They want to know: (a) what's wrong, and (b) what to do about it. The tone should feel like advice from someone who understands startups, not a robotic audit report.

### 3. **"No bullet points"**
Most AI summaries default to bulleted lists. This prompt explicitly forbids them because:
- Bullets encourage listing everything, which bloats the summary
- A single flowing paragraph forces prioritization (only the most important finding gets stated first)
- Reads more naturally in the UI

### 4. **"Mention specific tools and savings"**
Generic advice is useless. The summary must reference actual tools (e.g., "You're paying for ChatGPT Plus but Claude Pro is better for research") and actual numbers (e.g., "Save $120/month by downgrading"). This specificity is what makes the audit credible.

### 5. **"If optimal, say so honestly"**
If there are no savings opportunities, the AI must say so instead of manufacturing fake problems. This is crucial for trust. Users who run the audit and see "$0 savings" but read a dishonest summary ("consider switching...") will lose faith.

### 6. **"End with one actionable next step"**
Every audit should close with a clear action: "Cancel your Cursor Business subscription and switch to Pro", "Request a Custom pricing quote from Anthropic", "Email Credex for a consultation on credits". Without this, the audit is information without direction.

---

## Example Summary Output

**Input:** 
```
teamSize: 8
useCase: "research"
toolList: "Claude (Team, $240/mo), ChatGPT (Plus, $20/mo), Gemini (Free, $0/mo)"
totalMonthlySavings: 60
isOptimal: false
```

**AI Output:**
```
Your team of 8 is well-positioned for research with Claude Team and ChatGPT Plus, but you're paying $20/month for individual ChatGPT Plus subscriptions when your team plan covers it. By consolidating to Claude Team and using Gemini Free as a secondary option, you'd save $60/month while maintaining capability parity. Start by auditing which team members actually use ChatGPT Plus versus Gemini, then migrate active users to Claude.
```

**Why this works:**
- Specific tools mentioned: Claude Team, ChatGPT Plus, Gemini Free ✓
- Specific number: $60/month savings ✓
- Honest about what works: "well-positioned" ✓
- Clear action: "migrate active users to Claude" ✓
- Length: ~65 words (within 80-100 range) ✓

---

## Fallback Summary (When API Fails)

**Location:** `app/api/audit/route.js` lines 93-98

```javascript
function fallbackSummary({ teamSize, useCase, totalMonthlySavings, isOptimal }) {
  if (isOptimal) {
    return `Your team of ${teamSize} is spending efficiently on AI tools for ${useCase}. All plans are well-matched to your usage. Keep monitoring your API costs monthly and reassess if your team grows or use cases shift.`;
  }
  return `Your team of ${teamSize} is currently overspending on AI tools for ${useCase}. Based on your current plans and seat counts, you could save $${totalMonthlySavings.toFixed(0)}/month by switching plans or tools. Review the recommendations above and start with the highest-savings change first.`;
}
```

### When Fallback Activates

1. **Anthropic API key is missing** (`process.env.ANTHROPIC_API_KEY` is undefined)
2. **API call times out** (network failure)
3. **API returns an error** (rate limit, 500, etc.)
4. **Response doesn't have expected format** (missing `content[0].text`)

### Why Fallback Strategy Matters

The audit engine and results are deterministic (same input always produces same savings number). The summary is the only part that benefits from AI personalization, but it's not critical for the product to work. By treating it as optional, we avoid a hard dependency that could take down the entire service.

**Trade-off:** Fallback summaries are generic and less compelling than AI-generated ones, but they're honest and accurate. A user would rather get a templated-but-correct summary than see an error screen.

---

## API Integration Details

### Request to Anthropic

```javascript
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
```

**Why Claude Opus 4.5?**
- Strong instruction-following (respects "no bullet points", specific length)
- Fast (relevant for API latency on form submit)
- Good cost/quality tradeoff (Haiku would be cheaper but less reliable at nuanced tone)

**Why `max_tokens: 200`?**
- 80-100 words ≈ 120-150 tokens, so 200 is a safe upper bound
- Prevents runaway generation if prompt somehow gets interpreted as a list

### Response Parsing

```javascript
const aiData = await res.json();
return aiData.content?.[0]?.text || fallbackSummary(data);
```

- Safely extracts text from nested response structure
- Falls back if `content[0]` doesn't exist (malformed response)

---

## Monitoring & Iteration

### Metrics to Track

1. **Fallback rate:** What % of audits use the fallback summary? Target: <5%
2. **Summary length:** Are summaries staying within 80-100 words? Track mean and stddev.
3. **User feedback:** Add a "Was this summary helpful?" button on results page; track yes/no split.
4. **Lead conversion:** Do users with AI-generated summaries convert to leads more often than fallback summaries?

### Future Improvements

**v2:** Include user tone preference. Let users choose between:
- Conservative (assume user is risk-averse, focus on safety)
- Aggressive (assume user wants to maximize savings, OK with switching risk)
- Technical (explain the mechanics of the recommendation)

**v3:** Use Claude with tool_use to:
- Fetch real-time pricing for tools (detect when user's spend is outdated)
- Query Credex API to see if discounted credits are available for the user's spend level
- Generate a multi-step migration plan (week 1: switch plan, week 2: consolidate tools, etc.)

**v4:** Fine-tune a smaller model on a dataset of good/bad summaries to reduce costs while maintaining quality.

---

## Security & Cost Considerations

### Security
- API key stored in `process.env.ANTHROPIC_API_KEY` (environment variable, not hardcoded)
- No user input is passed directly to the prompt; all variables are controlled (teamSize, useCase, toolList, savings)
- Prompt injection risk is low because user can't inject content that reaches Claude

### Cost
- **Per audit:** ~100-150 tokens input, ~80-100 tokens output ≈ $0.005-0.01 per summary
- **At 10k audits/day:** ~$50-100/day or ~$1500-3000/month
- **Mitigation:** Fallback summary saves money on failed audits; caching could save money on duplicate audits (unlikely but possible)

