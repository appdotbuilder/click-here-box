
import { z } from 'zod';

// Minimal schema for potential future use
export const clickEventSchema = z.object({
  id: z.number(),
  timestamp: z.coerce.date(),
  button_label: z.string()
});

export type ClickEvent = z.infer<typeof clickEventSchema>;

// Input schema for recording click events (if needed in future)
export const createClickEventInputSchema = z.object({
  button_label: z.string()
});

export type CreateClickEventInput = z.infer<typeof createClickEventInputSchema>;
