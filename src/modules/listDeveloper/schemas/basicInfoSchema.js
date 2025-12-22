import { z } from "zod";

export const basicInfoSchema = z.object({
  developerName: z
    .string()
    .min(2, "Developer name must be at least 2 characters")
    .max(100, "Developer name is too long"),

  subscribeForDeveloperPage: z.boolean().optional(),
});

export default basicInfoSchema;
