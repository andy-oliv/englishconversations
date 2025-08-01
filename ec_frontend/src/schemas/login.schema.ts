import * as z from "zod";

export const LoginSchema = z.object({
  email: z.email({
    message: "O email deve ser um email válido (ex: eu@email.com.br)",
  }),
  password: z
    .string()
    .min(8, {
      message: "A senha deve ter pelo menos 8 caracteres",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "A senha deve ter ao menos 1 letra maiúscula",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "A senha deve ter ao menos 1 letra minúscula",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "A senha deve ter ao menos 1 número",
    })
    .refine((val) => /[^A-Za-z0-9]/.test(val), {
      message: "A senha deve ter ao menos 1 caractere especial",
    }),
});

export type Login = z.infer<typeof LoginSchema>;
