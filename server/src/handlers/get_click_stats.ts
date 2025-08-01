
import { db } from '../db';
import { clickEventsTable } from '../db/schema';
import { type ClickEvent } from '../schema';
import { sql, desc } from 'drizzle-orm';

export const getClickStats = async (): Promise<ClickEvent[]> => {
  try {
    // Get all click events ordered by most recent first
    const results = await db.select()
      .from(clickEventsTable)
      .orderBy(desc(clickEventsTable.timestamp))
      .execute();

    // Convert database results to schema format
    return results.map(result => ({
      id: result.id,
      button_label: result.button_label,
      timestamp: result.timestamp
    }));
  } catch (error) {
    console.error('Failed to fetch click stats:', error);
    throw error;
  }
};
