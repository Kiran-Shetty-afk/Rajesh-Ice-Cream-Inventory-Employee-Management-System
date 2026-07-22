"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { employeeSchema, employeeLoanSchema } from "@/lib/schemas";
import { z } from "zod";

export async function createEmployee(data: z.infer<typeof employeeSchema>): Promise<{ success?: boolean; error?: any }> {
  const result = employeeSchema.safeParse(data);
  if (!result.success) return { error: result.error.format() };

  try {
    await prisma.employee.create({
      data: {
        employeeCode: result.data.employeeCode,
        name: result.data.name,
        mobileNumber: result.data.mobileNumber,
        address: result.data.address,
        joiningDate: result.data.joiningDate,
        monthlySalary: result.data.monthlySalary,
      },
    });
    revalidatePath("/employees");
    return { success: true };
  } catch (err: any) {
    console.error("[Action Error]:", err);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function updateEmployee(id: string, data: z.infer<typeof employeeSchema>): Promise<{ success?: boolean; error?: any }> {
  const result = employeeSchema.safeParse(data);
  if (!result.success) return { error: result.error.format() };

  try {
    await prisma.employee.update({
      where: { id },
      data: {
        employeeCode: result.data.employeeCode,
        name: result.data.name,
        mobileNumber: result.data.mobileNumber,
        address: result.data.address,
        joiningDate: result.data.joiningDate,
        monthlySalary: result.data.monthlySalary,
      },
    });
    revalidatePath("/employees");
    return { success: true };
  } catch (err: any) {
    console.error("[Action Error]:", err);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function toggleEmployeeStatus(id: string): Promise<{ success?: boolean; error?: any }> {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: { loans: true }
    });
    
    if (!employee) return { error: "Employee not found." };

    const newStatus = employee.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    await prisma.$transaction(async (tx) => {
      await tx.employee.update({
        where: { id },
        data: { status: newStatus },
      });

      if (newStatus === "INACTIVE") {
        // Calculate remaining loan balance
        const totalLoan = employee.loans.reduce((sum, loan) => sum + loan.amount, 0);
        // We do not log total salary here, just the pure remaining loan balance
        // To be precise, if they haven't paid off the loan, the balance is totalLoan.
        // If we want the full finance balance (salary minus loan), we could use salarySummary.
        // For now we just store totalLoan as requested ("remaining loan amount").
        await tx.employeeExitLog.create({
          data: {
            employeeId: id,
            remainingLoan: totalLoan,
            notes: "Automatically logged upon marking INACTIVE."
          }
        });
      }
    });

    revalidatePath("/employees");
    return { success: true };
  } catch (err: any) {
    console.error("[Action Error]:", err);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function deleteEmployee(id: string): Promise<{ success?: boolean; error?: any }> {
  try {
    await prisma.employee.delete({
      where: { id },
    });
    revalidatePath("/employees");
    return { success: true };
  } catch (err: any) {
    return { error: "Cannot delete employee. They may have active loans." };
  }
}

export async function createEmployeeLoan(data: z.infer<typeof employeeLoanSchema>): Promise<{ success?: boolean; error?: any }> {
  const result = employeeLoanSchema.safeParse(data);
  if (!result.success) return { error: result.error.format() };

  try {
    await prisma.employeeLoan.create({
      data: {
        employeeId: result.data.employeeId,
        amount: result.data.amount,
        loanDate: result.data.loanDate,
        note: result.data.note,
      },
    });
    revalidatePath(`/employees/${result.data.employeeId}`);
    revalidatePath("/employees");
    return { success: true };
  } catch (err: any) {
    console.error("[Action Error]:", err);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function deleteEmployeeLoan(id: string): Promise<{ success?: boolean; error?: any }> {
  try {
    const loan = await prisma.employeeLoan.findUnique({ where: { id } });
    if (!loan) return { error: "Loan not found" };

    await prisma.employeeLoan.delete({ where: { id } });
    revalidatePath(`/employees/${loan.employeeId}`);
    revalidatePath("/employees");
    return { success: true };
  } catch (err: any) {
    console.error("[Action Error]:", err);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
