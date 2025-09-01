import * as z from "zod";

export const StateSchema = z.object({
  id: z.number(),
  nome: z.string(),
  sigla: z.string(),
});

export type State = z.infer<typeof StateSchema>;

export const StatesSchema = z.array(StateSchema);
