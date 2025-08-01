
import { z } from 'zod';

// Button click schema
export const buttonClickSchema = z.object({
  id: z.number(),
  clicked_at: z.coerce.date(),
  user_session: z.string().nullable()
});

export type ButtonClick = z.infer<typeof buttonClickSchema>;

// Input schema for recording button clicks
export const recordClickInputSchema = z.object({
  user_session: z.string().nullable()
});

export type RecordClickInput = z.infer<typeof recordClickInputSchema>;

// Schema for getting click statistics
export const clickStatsSchema = z.object({
  total_clicks: z.number(),
  recent_clicks: z.number()
});

export type ClickStats = z.infer<typeof clickStatsSchema>;
