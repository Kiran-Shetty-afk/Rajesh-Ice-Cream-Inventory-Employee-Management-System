import { z } from "zod";

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  flavor: z.string().min(1, "Flavor is required"),
  unitPrice: z.coerce.number().min(0, "Price must be positive"),
  factoryQuantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  lowStockQuantity: z.coerce.number().min(0, "Low stock quantity cannot be negative"),
});

export const rawMaterialSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  unit: z.string().min(1, "Unit is required"),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  unitCost: z.coerce.number().min(0, "Unit cost must be positive"),
  lowStockQuantity: z.coerce.number().min(0, "Low stock quantity cannot be negative"),
  supplier: z.string().optional(),
});

export const shopSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Shop name is required"),
  managerName: z.string().optional(),
  mobileNumber: z.string().optional(),
  address: z.string().optional(),
});

export const employeeSchema = z.object({
  id: z.string().optional(),
  employeeCode: z.string().min(1, "Employee code is required"),
  name: z.string().min(1, "Name is required"),
  mobileNumber: z.string().min(10, "Valid mobile number is required"),
  address: z.string().optional(),
  joiningDate: z.coerce.date(),
  monthlySalary: z.coerce.number().min(0, "Salary must be positive"),
});

export const employeeLoanSchema = z.object({
  id: z.string().optional(),
  employeeId: z.string().min(1, "Employee is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  loanDate: z.coerce.date(),
  note: z.string().optional(),
});

export const transferItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
});

export const stockTransferSchema = z.object({
  shopId: z.string().min(1, "Shop is required"),
  note: z.string().optional(),
  items: z.array(transferItemSchema).min(1, "At least one item is required"),
});

export const dailySaleItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  unitPrice: z.coerce.number().min(0, "Unit price must be non-negative"),
  totalPrice: z.coerce.number().min(0, "Total price must be non-negative"),
  wastage: z.coerce.number().min(0).default(0),
  returned: z.coerce.number().min(0).default(0),
});

export const dailySaleSchema = z.object({
  date: z.coerce.date(),
  shopId: z.string().min(1, "Shop is required"),
  notes: z.string().optional(),
  items: z.array(dailySaleItemSchema).min(1, "At least one item is required"),
});

