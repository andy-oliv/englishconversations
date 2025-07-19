import * as z from 'zod';

export const StateSchema = z.object({
  id: z.number(),
  sigla: z.string(),
});

export type State = z.infer<typeof StateSchema>;

export const StatesSchema = z.array(StateSchema);
export type States = z.infer<typeof StatesSchema>;
