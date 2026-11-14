import { describe, expect, it } from 'vitest';
import { Entity } from './entity.js';
import { UniqueId } from './value-objects/unique-entity-id.js';

class TestEntity extends Entity {
  constructor(id: UniqueId) {
    super(id);
  }
}

describe('Entity and UniqueId', () => {
  it('compares entities by ID and formats its string representation', () => {
    const first = new TestEntity(new UniqueId('same-id'));
    const second = new TestEntity(new UniqueId('same-id'));
    const different = new TestEntity(new UniqueId('other-id'));

    expect(first.getId().getValue()).toBe('same-id');
    expect(first.equals(second)).toBe(true);
    expect(first.equals(different)).toBe(false);
    expect(first.equals(null as unknown as Entity)).toBe(false);
    expect(first.toString()).toBe('TestEntity [id=same-id]');
  });

  it('creates unique IDs when none are supplied', () => {
    const first = new UniqueId();
    const second = new UniqueId();

    expect(first.getValue()).not.toBe(second.getValue());
    expect(first.equals(second)).toBe(false);
    expect(first.toString()).toBe(first.getValue());
  });
});
