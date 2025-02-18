import { z } from 'zod';

export const AddressSuggestionRequestSchema = z.object({
  query: z.string().min(1, "Query must be at least 1 character"),
  countryCode: z.string().optional(),
  limit: z.number().optional(),
});

export type AddressSuggestionRequestDto = z.infer<typeof AddressSuggestionRequestSchema>;