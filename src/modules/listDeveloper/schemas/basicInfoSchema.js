import { z } from "zod";

export const basicInfoSchema = z.object({
  developerName: z
    .string()
    .min(2, "Developer name must be at least 2 characters")
    .max(100, "Developer name is too long"),

  developerType: z.enum(
    ["International Developer", "National Developer", "Regional Developer"],
    {
      required_error: "Please select a developer type",
    }
  ).optional(),

  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(1000, "Description is too long")
    .optional(),

  establishedYear: z
    .number()
    .int("Year must be a whole number")
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .optional(),

  registrationNumber: z
    .string()
    .min(5, "Registration number is too short")
    .max(50, "Registration number is too long")
    .optional(),
});

export default basicInfoSchema;
