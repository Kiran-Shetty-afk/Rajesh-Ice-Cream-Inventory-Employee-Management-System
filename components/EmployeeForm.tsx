"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { createEmployee, updateEmployee } from "@/app/actions/employees";
import { Employee } from "@prisma/client";

interface EmployeeFormProps {
  employee?: Employee;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EmployeeForm({ employee, onSuccess, onCancel }: EmployeeFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      employeeCode: formData.get("employeeCode") as string,
      name: formData.get("name") as string,
      mobileNumber: formData.get("mobileNumber") as string,
      address: (formData.get("address") as string) || undefined,
      joiningDate: new Date(formData.get("joiningDate") as string),
      monthlySalary: Number(formData.get("monthlySalary")),
    };

    const res = employee
      ? await updateEmployee(employee.id, data)
      : await createEmployee(data);

    setLoading(false);
    if (res.error) {
      if (typeof res.error === "string") {
        setError(res.error);
      } else {
        setError("Validation failed. Please check your inputs.");
      }
    } else {
      onSuccess();
    }
  }

  const defaultDate = employee ? new Date(employee.joiningDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">{error}</div>}
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Employee Code</label>
          <input name="employeeCode" defaultValue={employee?.employeeCode} required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
        </div>
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Full Name</label>
          <input name="name" defaultValue={employee?.name} required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Mobile Number</label>
          <input name="mobileNumber" defaultValue={employee?.mobileNumber} required minLength={10} className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
        </div>
        <div>
          <label className="block text-sm font-medium text-cocoa/80 mb-1">Monthly Salary (₹)</label>
          <input type="number" step="0.01" name="monthlySalary" defaultValue={employee?.monthlySalary} required min="0" className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-cocoa/80 mb-1">Joining Date</label>
        <input type="date" name="joiningDate" defaultValue={defaultDate} required className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
      </div>

      <div>
        <label className="block text-sm font-medium text-cocoa/80 mb-1">Address</label>
        <textarea name="address" defaultValue={employee?.address || ""} rows={2} className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-strawberry" />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-cocoa/80 bg-white border rounded-md hover:bg-vanilla/55 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="primary-button">
          {loading ? "Saving..." : "Save Employee"}
        </button>
      </div>
    </form>
  );
}

export function EmployeeDialog({ employee, trigger }: { employee?: Employee, trigger?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <span onClick={() => setIsOpen(true)} className="cursor-pointer inline-block">
        {trigger || <button className="primary-button">Add Employee</button>}
      </span>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={employee ? "Edit Employee" : "Add Employee"}>
        <EmployeeForm employee={employee} onCancel={() => setIsOpen(false)} onSuccess={() => setIsOpen(false)} />
      </Modal>
    </>
  );
}
