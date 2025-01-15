import { z } from "zod";

export const personalInfoSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  dob: z.string().date(),
});
