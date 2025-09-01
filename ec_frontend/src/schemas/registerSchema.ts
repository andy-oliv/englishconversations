import * as z from "zod";

export const RegisterSchema = z
  .object({
    name: z.string({ message: "Insira o nome completo" }),
    state: z.string({ message: "Selecione o estado" }),
    city: z.string({ message: "Selecione a cidade" }),
    birthdate: z.string({ message: "Selecione a data de nascimento" }),
    email: z.email({
      message: "O email deve ser um email válido. Ex: eu@mail.com.br",
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
    passwordConfirmation: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirmation) {
      ctx.addIssue({
        code: "custom",
        message: "Os campos não são iguais.",
        path: ["passwordConfirmation"],
      });
    }
  });

export type Register = z.infer<typeof RegisterSchema>;
