import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Korisničko ime je obavezno"),
  password: z.string().min(1, "Lozinka je obavezna"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;


export const regSchema = z.object({
  name: z
      .string()
      .min(2, "Ime mora imati najmanje 2 znaka")
      .max(60, "Ime je predugačko"),
  username: z
      .string()
      .min(3, "Korisničko ime mora imati najmanje 3 znaka")
      .max(30, "Korisničko ime je predugačko")
      .regex(/^[a-zA-Z0-9_]+$/, "Samo slova, brojevi i donja crta su dozvoljeni"),
  password: z
      .string()
      .min(8, "Lozinka mora imati najmanje 8 karaktera")
      .regex(/[A-Z]/, "Dodajte bar jedno veliko slovo")
      .regex(/[a-z]/, "Dodajte bar jedno malo slovo")
      .regex(/[0-9]/, "Dodajte bar jednu cifru"),
});

export type RegisterFormValues = z.infer<typeof regSchema>;