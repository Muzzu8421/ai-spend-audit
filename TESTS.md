# TESTS.md

## Test Files in Project

**Status:** No test files found in current codebase (as of 2026-05-27).

According to DEVLOG (Day 7), 5 audit engine tests were written, but they are not present in the repository. This is a **critical gap** — the audit engine is the core business logic, and financial calculations need test coverage. Below are the tests that should exist.

---

## Required Tests

### Audit Engine Tests (5 minimum)

**File:** `lib/__tests__/auditEngine.test.js`

#### Test 1: Detects Billing Discrepancy
**What it covers:** When a user reports spending more than the expected cost for their plan + seat count, the engine flags it as a billing discrepancy.

```javascript
test('flags overspending vs. listed price', () => {
  const entries = [{
    tool: 'cursor',
    plan: 'pro',
    seats: 2,
    monthlySpend: 100  // Should be 2 × $20 = $40
  }];
  
  const { results } = runAudit(entries, 5, 'coding');
  expect(results[0].savings).toBe(60);
  expect(results[0].recommendation).toContain('Check your billing');
});
```

**Why:** Protects against data entry errors and catches actual billing bugs.

---

#### Test 2: Recommends Downgrade for Enterprise with Few Seats
**What it covers:** If a user has Enterprise plan with ≤10 seats, recommend Business.

```javascript
test('downgrade enterprise to business for small teams', () => {
  const entries = [{
    tool: 'cursor',
    plan: 'enterprise',
    seats: 5,
    monthlySpend: 300  // 5 × $60
  }];
  
  const { results } = runAudit(entries, 5, 'coding');
  expect(results[0].savings).toBe(100); // 5 × ($60 - $40)
  expect(results[0].recommendation).toContain('Business');
});
```

**Why:** Tests the core downgrade logic; ensures the engine doesn't waste money on overprovisioned plans.

---

#### Test 3: Finds Cheaper Alternative by Use Case
**What it covers:** For a user paying for expensive tool in their use case, recommend cheaper alternative from ALTERNATIVES map.

```javascript
test('recommends cheaper alternative (chatgpt to claude for research)', () => {
  const entries = [{
    tool: 'chatgpt',
    plan: 'plus',
    seats: 1,
    monthlySpend: 20  // ChatGPT Plus at list price
  }];
  
  const { results } = runAudit(entries, 3, 'research');
  expect(results[0].savings).toBe(0); // Both are $20, but recommendation explains Claude is better for research
  expect(results[0].recommendation).toContain('Claude');
});
```

**Why:** Tests use-case-aware recommendations; core value prop of the audit.

---

#### Test 4: Correctly Calculates Total Monthly and Annual Savings
**What it covers:** runAudit returns accurate totalMonthlySavings and totalAnnualSavings across multiple tools.

```javascript
test('calculates total savings correctly', () => {
  const entries = [
    { tool: 'cursor', plan: 'pro', seats: 2, monthlySpend: 50 },    // Overspending by $10
    { tool: 'claude', plan: 'pro', seats: 1, monthlySpend: 25 },     // Overspending by $5
  ];
  
  const { totalMonthlySavings, totalAnnualSavings } = runAudit(entries, 3, 'coding');
  expect(totalMonthlySavings).toBe(15);
  expect(totalAnnualSavings).toBe(180);
});
```

**Why:** Critical for financial accuracy; this is the headline number users see.

---

#### Test 5: Returns isOptimal=true When No Savings Available
**What it covers:** If a user's spend is already optimal, the engine doesn't force-generate fake savings.

```javascript
test('returns isOptimal true when no savings exist', () => {
  const entries = [{
    tool: 'cursor',
    plan: 'pro',
    seats: 1,
    monthlySpend: 20  // Exact list price
  }];
  
  const { isOptimal, totalMonthlySavings, results } = runAudit(entries, 1, 'coding');
  expect(isOptimal).toBe(true);
  expect(totalMonthlySavings).toBe(0);
  expect(results[0].recommendation).toContain('optimal');
});
```

**Why:** Trust is crucial; honesty about good choices builds credibility.

---

### Component Tests (Optional but Recommended)

**File:** `components/__tests__/AuditForm.test.js`

- **Test:** Form submission sends correct payload to `/api/audit`
- **Test:** Adding a tool adds a new empty row
- **Test:** Removing a tool filters it out
- **Test:** localStorage persists form state across page reloads

**File:** `components/__tests__/LeadCapture.test.js`

- **Test:** Honeypot field doesn't get sent to server
- **Test:** Submission POSTs to `/api/leads` with email, company, role, auditId, savings
- **Test:** Disabled submit button while loading

---

### Integration Tests (Optional but Recommended)

**File:** `__tests__/integration/audit-flow.test.js`

- **Test:** Full flow: POST /api/audit → MongoDB save → GET /results/[id] returns audit
- **Test:** Lead capture: POST /api/leads → email sent via Resend
- **Test:** Rate limiting: 4th request from same IP returns 429

---

## How to Run Tests

### Setup (one-time)

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### Create jest.config.js

```javascript
export default {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
```

### Create jest.setup.js

```javascript
import '@testing-library/jest-dom';
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run only audit engine tests
npm test -- lib/__tests__/auditEngine.test.js

# Run with coverage
npm test -- --coverage
```

### CI Integration

Add to package.json:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

Then in `.github/workflows/ci.yml`, add:

```yaml
- name: Run tests
  run: npm test -- --coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

---

## Coverage Goals

| Module | Current | Target | Status |
|--------|---------|--------|--------|
| `lib/auditEngine.js` | 0% | 90%+ | ❌ CRITICAL |
| `lib/pricingData.js` | 0% | N/A (data) | ⏭️ |
| `components/AuditForm.js` | 0% | 70%+ | ⏭️ |
| `components/AuditResults.js` | 0% | 60%+ | ⏭️ |
| `app/api/audit/route.js` | 0% | 80%+ | ⏭️ |
| `app/api/leads/route.js` | 0% | 75%+ | ⏭️ |

**Priority:** Write audit engine tests first. That's the core business logic and must be airtight.

---

## Testing Checklist

- [ ] All audit engine rules covered (billing discrepancy, downgrade, cheaper alt, optimal)
- [ ] Total savings calculation tested
- [ ] API routes return correct status codes (200, 400, 429, 500)
- [ ] MongoDB connection handles failure gracefully
- [ ] Anthropic API fallback summary works when API is down
- [ ] Rate limiter resets correctly after time window
- [ ] Honeypot silently rejects (doesn't error)
- [ ] Results page 404s for non-existent audit ID
- [ ] Open Graph meta tags render with correct values
- [ ] Email is sent to lead with correct shareable URL

