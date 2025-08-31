import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Korisničko ime je obavezno"),
  password: z.string().min(1, "Lozinka je obavezna"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
