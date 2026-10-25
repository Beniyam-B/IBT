import { z } from "zod";
import { AREAS } from "./areas";

// Spaces and dashes are ignored: "0912 345 678" is the same number as "0912345678".
const phone = z
  .string()
  .transform((value) => value.replace(/[\s-]/g, ""))
  .pipe(z.string().regex(/^(09|\+2519)\d{8}$/, "Phone number must start with 09… or +2519… followed by 8 digits"));

// The one schema used by the checkout form AND the server (Day 33 + Day 39).
export const orderSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone,
  dishId: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1").optional().default(1),
  notes: z.string().max(200, "Notes cannot exceed 200 characters").optional(),
  // the cart, sent by the checkout form as a JSON string
  items: z.string().optional(),
  // optional here so POST /api/orders keeps working; the checkout form requires it (below)
  area: z.enum(AREAS, { message: "Choose a delivery area" }).optional(),
});

// What the checkout FORM sends: the same fields, with the delivery area required.
export const checkoutSchema = orderSchema.extend({
  area: z.enum(AREAS, { message: "Choose your delivery area" }),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone,
  email: z.string().email("Enter a valid email address").or(z.literal("")).optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, "Enter your phone number or email"),
  password: z.string().min(1, "Password is required"),
});
