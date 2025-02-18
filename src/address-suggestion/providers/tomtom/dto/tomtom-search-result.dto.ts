//update here if need more fields from tomtom api
import { z } from 'zod';

export const TomTomSearchResultSchema = z.object({
  id: z.string(),
  address: z.object({
    streetName: z.string(),
    municipality: z.string(),
    postalCode: z.string(),
    countryCode: z.string(),
    country: z.string(),
    countrySubdivisionName: z.string(),
    freeformAddress: z.string(),
  }),
  position: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
});

export type TomTomSearchResultDto = z.infer<typeof TomTomSearchResultSchema>;