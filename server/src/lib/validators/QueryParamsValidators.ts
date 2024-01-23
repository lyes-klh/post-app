import { z } from "zod";

export const QueryParamsSchema = z.object({
  page: z.coerce.number().min(1),
});
