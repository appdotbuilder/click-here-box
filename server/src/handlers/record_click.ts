
import { db } from '../db';
import { clickEventsTable } from '../db/schema';
import { type CreateClickEventInput, type ClickEvent } from '../schema';

export const recordClick = async (input: CreateClickEventInput): Promise<ClickEvent> => {
  try {
    // Insert click event record
    const result = await db.insert(clickEventsTable)
      .values({
        button_label: input.button_label
        // timestamp will be automatically set by defaultNow()
      })
      .returning()
      .execute();

    const clickEvent = result[0];
    return {
      id: clickEvent.id,
      button_label: clickEvent.button_label,
      timestamp: clickEvent.timestamp
    };
  } catch (error) {
    console.error('Click event recording failed:', error);
    throw error;
  }
};
