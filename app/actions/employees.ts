"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { employeeSchema, employeeLoanSchema } from "@/lib/schemas";
import { z } from "zod";

export async function createEmployee(data: z.infer<typeof employeeSchema>) {
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
    return { error: err.message };
  }
}

export async function updateEmployee(id: string, data: z.infer<typeof employeeSchema>) {
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
    return { error: err.message };
  }
}

export async function deactivateEmployee(id: string) {
  try {
    await prisma.employee.update({
      where: { id },
      data: { status: "INACTIVE" },
    });
    revalidatePath("/employees");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteEmployee(id: string) {
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

export async function createEmployeeLoan(data: z.infer<typeof employeeLoanSchema>) {
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
    return { error: err.message };
  }
}

export async function deleteEmployeeLoan(id: string) {
  try {
    const loan = await prisma.employeeLoan.findUnique({ where: { id } });
    if (!loan) return { error: "Loan not found" };

    await prisma.employeeLoan.delete({ where: { id } });
    revalidatePath(`/employees/${loan.employeeId}`);
    revalidatePath("/employees");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
