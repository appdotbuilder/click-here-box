
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { clickEventsTable } from '../db/schema';
import { getClickStats } from '../handlers/get_click_stats';

describe('getClickStats', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no click events exist', async () => {
    const result = await getClickStats();
    
    expect(result).toEqual([]);
  });

  it('should return all click events', async () => {
    // Create test data
    await db.insert(clickEventsTable)
      .values([
        { button_label: 'Click Here' },
        { button_label: 'Submit' },
        { button_label: 'Cancel' }
      ])
      .execute();

    const result = await getClickStats();

    expect(result).toHaveLength(3);
    expect(result[0].button_label).toBeDefined();
    expect(result[0].timestamp).toBeInstanceOf(Date);
    expect(result[0].id).toBeDefined();
  });

  it('should return click events ordered by most recent first', async () => {
    // Create test data with slight delay to ensure different timestamps
    await db.insert(clickEventsTable)
      .values({ button_label: 'First Click' })
      .execute();

    // Small delay to ensure different timestamp
    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(clickEventsTable)
      .values({ button_label: 'Second Click' })
      .execute();

    const result = await getClickStats();

    expect(result).toHaveLength(2);
    // Most recent should be first (Second Click)
    expect(result[0].button_label).toEqual('Second Click');
    expect(result[1].button_label).toEqual('First Click');
    expect(result[0].timestamp >= result[1].timestamp).toBe(true);
  });

  it('should handle multiple clicks with same button label', async () => {
    // Create multiple clicks with same button label
    await db.insert(clickEventsTable)
      .values([
        { button_label: 'Click Here' },
        { button_label: 'Click Here' },
        { button_label: 'Click Here' }
      ])
      .execute();

    const result = await getClickStats();

    expect(result).toHaveLength(3);
    result.forEach(clickEvent => {
      expect(clickEvent.button_label).toEqual('Click Here');
      expect(clickEvent.id).toBeDefined();
      expect(clickEvent.timestamp).toBeInstanceOf(Date);
    });
  });
});
