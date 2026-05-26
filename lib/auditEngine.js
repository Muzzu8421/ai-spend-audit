import { TOOLS, ALTERNATIVES } from "./pricingData.js";

export function runAudit(entries, teamSize, useCase) {
  const results = entries.map((entry) => auditEntry(entry, teamSize, useCase));
  const totalMonthlySavings = results.reduce((sum, r) => sum + r.savings, 0);

  return {
    results,
    totalMonthlySavings: Math.max(0, totalMonthlySavings),
    totalAnnualSavings: Math.max(0, totalMonthlySavings * 12),
    isOptimal: totalMonthlySavings <= 0,
  };
}

function auditEntry(entry, teamSize, useCase) {
  const { tool, plan, seats, monthlySpend } = entry;
  const toolData = TOOLS[tool];

  if (!toolData) {
    return makeResult(entry, monthlySpend, 0, "Unknown tool", "No data available");
  }

  const planData = toolData.plans[plan];

  // Variable/API pricing — can't audit spend without usage data
  if (!planData || planData.variable) {
    return makeResult(
      entry,
      monthlySpend,
      0,
      "Review API usage",
      "API costs are usage-based. Set a budget alert and review monthly."
    );
  }

  const expectedMonthly = planData.pricePerSeat * seats;

  // 1. Are they overpaying vs. listed price?
  if (monthlySpend > expectedMonthly * 1.1) {
    const savings = monthlySpend - expectedMonthly;
    return makeResult(
      entry,
      monthlySpend,
      savings,
      `You're paying $${monthlySpend}/mo but the ${planData.label} plan for ${seats} seat(s) should be $${expectedMonthly}/mo. Check your billing.`,
      "Billing discrepancy"
    );
  }

  // 2. Are they on the wrong plan for seat count?
  const downgrade = checkDowngrade(tool, plan, seats);
  if (downgrade) {
    const savings = expectedMonthly - downgrade.newCost;
    if (savings > 0) {
      return makeResult(
        entry,
        monthlySpend,
        savings,
        `Switch to ${downgrade.label} — saves $${savings}/mo for ${seats} seat(s).`,
        downgrade.reason
      );
    }
  }

  // 3. Is there a cheaper alternative for their use case?
  const alt = checkAlternative(tool, plan, seats, monthlySpend, useCase);
  if (alt && alt.savings > 5) {
    return makeResult(
      entry,
      monthlySpend,
      alt.savings,
      `Switch to ${alt.label} — saves $${alt.savings}/mo with similar capability for ${useCase}.`,
      "Cheaper alternative available"
    );
  }

  // 4. Already optimal
  return makeResult(entry, monthlySpend, 0, "Spend looks optimal.", "Good choice");
}

function checkDowngrade(tool, currentPlan, seats) {
  const toolData = TOOLS[tool];
  const plans = toolData.plans;

  if (currentPlan === "enterprise" && seats <= 10) {
    const businessPlan = plans.business;
    if (businessPlan) {
      return {
        label: `${toolData.name} Business`,
        newCost: businessPlan.pricePerSeat * seats,
        reason: `Enterprise is overkill for ${seats} seats. Business plan covers your needs.`,
      };
    }
  }

  if (currentPlan === "business" && seats === 1) {
    const proPlan = plans.pro || plans.individual;
    if (proPlan) {
      return {
        label: `${toolData.name} Pro`,
        newCost: proPlan.pricePerSeat * seats,
        reason: "Business plan for 1 user — Pro covers the same features.",
      };
    }
  }

  if (currentPlan === "team" && seats < 3) {
    const proPlan = plans.pro;
    if (proPlan) {
      return {
        label: `${toolData.name} Pro (per user)`,
        newCost: proPlan.pricePerSeat * seats,
        reason: `Team plan for ${seats} users costs more than individual Pro plans.`,
      };
    }
  }

  return null;
}

function checkAlternative(tool, plan, seats, monthlySpend, useCase) {
  const alts = ALTERNATIVES[useCase] || ALTERNATIVES["mixed"];

  const cheaper = alts
    .filter((a) => a.tool !== tool)
    .map((a) => ({ ...a, totalCost: a.price * seats, savings: monthlySpend - a.price * seats }))
    .filter((a) => a.savings > 5)
    .sort((a, b) => b.savings - a.savings);

  return cheaper[0] || null;
}

function makeResult(entry, currentSpend, savings, recommendation, reason) {
  return {
    tool: entry.tool,
    plan: entry.plan,
    seats: entry.seats,
    currentSpend,
    savings: Math.max(0, savings),
    recommendation,
    reason,
  };
}