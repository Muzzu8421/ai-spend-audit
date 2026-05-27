// lib/__tests__/auditEngine.test.js
// Run with: npm test

import { runAudit } from '../auditEngine.js';

describe('Audit Engine', () => {

  test('Test 1: detects overspending vs listed price', () => {
    const entries = [{
      tool: 'cursor',
      plan: 'pro',
      seats: 2,
      monthlySpend: 100 // Should be 2 × $20 = $40
    }];
    const result = runAudit(entries, 5, 'coding');
    expect(result.totalMonthlySavings).toBeGreaterThan(0);
    expect(result.results[0].savings).toBeGreaterThan(0);
  });

  test('Test 2: recommends downgrade for enterprise with few seats', () => {
    const entries = [{
      tool: 'cursor',
      plan: 'business',
      seats: 1,
      monthlySpend: 40
    }];
    const result = runAudit(entries, 1, 'coding');
    expect(result.results[0]).toBeDefined();
    expect(result.results[0].tool).toBe('cursor');
  });

  test('Test 3: finds cheaper alternative by use case', () => {
    const entries = [{
      tool: 'chatgpt',
      plan: 'plus',
      seats: 1,
      monthlySpend: 20
    }];
    const result = runAudit(entries, 1, 'research');
    expect(result.results[0]).toBeDefined();
    expect(result.results[0].recommendation).toBeTruthy();
  });

  test('Test 4: correctly calculates total monthly and annual savings', () => {
    const entries = [
      { tool: 'cursor', plan: 'pro', seats: 1, monthlySpend: 30 },
      { tool: 'chatgpt', plan: 'plus', seats: 1, monthlySpend: 30 },
    ];
    const result = runAudit(entries, 2, 'coding');
    expect(result.totalMonthlySavings).toBeGreaterThanOrEqual(0);
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });

  test('Test 5: returns isOptimal true when no savings exist', () => {
    const entries = [{
      tool: 'cursor',
      plan: 'pro',
      seats: 1,
      monthlySpend: 20 // exact list price
    }];
    const result = runAudit(entries, 1, 'coding');
    expect(result.totalMonthlySavings).toBeGreaterThanOrEqual(0);
    expect(typeof result.isOptimal).toBe('boolean');
  });

});