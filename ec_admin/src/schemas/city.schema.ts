import * as z from 'zod';

export const CitySchema = z.object({
  id: z.number(),
  nome: z.string(),
});

export type City = z.infer<typeof CitySchema>;

export const CitiesSchema = z.array(CitySchema);
export type Cities = z.infer<typeof CitiesSchema>;
