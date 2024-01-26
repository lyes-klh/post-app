import { z } from "zod";

export const QueryParamsSchema = z.object({
  page: z.coerce.number().min(1),
});

export const PathParamsSchema = z.object({
  id: z.string(),
});
