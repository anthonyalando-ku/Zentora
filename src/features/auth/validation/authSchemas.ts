import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerEmailSchema = z.object({
  email: z.string().email(),
});

export const verifyOtpSchema = z.object({
  otp: z.string().min(4).max(6),
});

export const registerProfileSchema = z
  .object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });