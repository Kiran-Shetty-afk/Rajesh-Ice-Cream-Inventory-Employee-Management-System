import { describe, it, expect } from 'vitest';
import { monthsWorked, salarySummary, money } from './finance';

describe('finance utilities', () => {
  it('calculates months worked correctly', () => {
    const joiningDate = new Date('2023-01-15');
    const asOf = new Date('2023-04-20');
    expect(monthsWorked(joiningDate, asOf)).toBe(4); // Jan, Feb, Mar, Apr
  });

  it('calculates salary summary correctly without bonus', () => {
    const joiningDate = new Date('2023-01-15');
    const asOf = new Date('2023-03-20'); // 3 months
    const result = salarySummary(10000, joiningDate, 5000, asOf);
    
    expect(result.months).toBe(3);
    expect(result.totalSalary).toBe(30000);
    expect(result.bonusEligible).toBe(false);
    expect(result.bonus).toBe(0);
    expect(result.totalEarnings).toBe(30000);
    expect(result.currentBalance).toBe(25000); // 30k - 5k
  });

  it('calculates salary summary correctly with bonus', () => {
    const joiningDate = new Date('2023-01-15');
    const asOf = new Date('2023-10-20'); // 10 months
    const result = salarySummary(10000, joiningDate, 0, asOf);
    
    expect(result.months).toBe(10);
    expect(result.bonusEligible).toBe(true);
    expect(result.bonus).toBe(100000 * 0.08); // 8k
    expect(result.totalEarnings).toBe(108000);
    expect(result.currentBalance).toBe(108000);
  });

  it('formats money correctly', () => {
    const formatted = money(1234567);
    // Depending on Node version, exact non-breaking spaces might differ, we check for digits
    expect(formatted.replace(/[^0-9,]/g, '')).toBe('12,34,567');
  });
});
