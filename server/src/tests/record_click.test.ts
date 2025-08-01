
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { clickEventsTable } from '../db/schema';
import { type CreateClickEventInput } from '../schema';
import { recordClick } from '../handlers/record_click';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateClickEventInput = {
  button_label: 'Click Here'
};

describe('recordClick', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should record a click event', async () => {
    const result = await recordClick(testInput);

    // Basic field validation
    expect(result.button_label).toEqual('Click Here');
    expect(result.id).toBeDefined();
    expect(result.timestamp).toBeInstanceOf(Date);
    expect(typeof result.id).toBe('number');
  });

  it('should save click event to database', async () => {
    const result = await recordClick(testInput);

    // Query using proper drizzle syntax
    const clickEvents = await db.select()
      .from(clickEventsTable)
      .where(eq(clickEventsTable.id, result.id))
      .execute();

    expect(clickEvents).toHaveLength(1);
    expect(clickEvents[0].button_label).toEqual('Click Here');
    expect(clickEvents[0].timestamp).toBeInstanceOf(Date);
    expect(clickEvents[0].id).toEqual(result.id);
  });

  it('should handle different button labels', async () => {
    const customInput: CreateClickEventInput = {
      button_label: 'Custom Button'
    };

    const result = await recordClick(customInput);

    expect(result.button_label).toEqual('Custom Button');
    expect(result.id).toBeDefined();
    expect(result.timestamp).toBeInstanceOf(Date);

    // Verify in database
    const clickEvents = await db.select()
      .from(clickEventsTable)
      .where(eq(clickEventsTable.id, result.id))
      .execute();

    expect(clickEvents[0].button_label).toEqual('Custom Button');
  });

  it('should record multiple click events with different timestamps', async () => {
    const firstClick = await recordClick({ button_label: 'First Click' });
    
    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const secondClick = await recordClick({ button_label: 'Second Click' });

    expect(firstClick.id).not.toEqual(secondClick.id);
    expect(firstClick.button_label).toEqual('First Click');
    expect(secondClick.button_label).toEqual('Second Click');
    expect(firstClick.timestamp.getTime()).toBeLessThanOrEqual(secondClick.timestamp.getTime());

    // Verify both events are in database
    const allEvents = await db.select()
      .from(clickEventsTable)
      .execute();

    expect(allEvents).toHaveLength(2);
  });
});
