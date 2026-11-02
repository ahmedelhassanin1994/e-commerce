import { describe, expect, it } from 'vitest';
import { Entity } from './entity.js';
import { UniqueEntityId } from './value-objects/unique-entity-id.js';

class TestEntity extends Entity {
  constructor(id: UniqueEntityId) {
    super(id);
  }
}

describe('Entity and UniqueEntityId', () => {
  it('compares entities by ID and formats its string representation', () => {
    const first = new TestEntity(new UniqueEntityId('same-id'));
    const second = new TestEntity(new UniqueEntityId('same-id'));
    const different = new TestEntity(new UniqueEntityId('other-id'));

    expect(first.getId().value).toBe('same-id');
    expect(first.equals(second)).toBe(true);
    expect(first.equals(different)).toBe(false);
    expect(first.equals(null as unknown as Entity)).toBe(false);
    expect(first.toString()).toBe('TestEntity [id=same-id]');
  });

  it('creates unique IDs when none are supplied', () => {
    const first = new UniqueEntityId();
    const second = new UniqueEntityId();

    expect(first.value).not.toBe(second.value);
    expect(first.equals()).toBe(false);
    expect(first.toString()).toBe(first.value);
  });
});
