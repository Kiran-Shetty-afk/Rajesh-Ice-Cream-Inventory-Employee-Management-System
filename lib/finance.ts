import { differenceInCalendarMonths } from "date-fns";

export function monthsWorked(joiningDate: Date, asOf = new Date()) {
  return Math.max(0, differenceInCalendarMonths(asOf, joiningDate) + 1);
}

export function salarySummary(monthlySalary: number, joiningDate: Date, totalLoan: number, asOf = new Date()) {
  const months = monthsWorked(joiningDate, asOf);
  const totalSalary = months * monthlySalary;
  const bonusEligible = months > 6;
  const bonus = bonusEligible ? totalSalary * 0.08 : 0;
  const totalEarnings = totalSalary + bonus;

  return {
    months,
    totalSalary,
    bonusEligible,
    bonus,
    totalEarnings,
    totalLoan,
    currentBalance: totalEarnings - totalLoan
  };
}

export function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}
