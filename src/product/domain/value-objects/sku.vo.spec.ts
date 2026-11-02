import { describe, expect, it } from 'vitest';
import { DomainException } from '../../../shared/domain/excptions/domain.excption.js';
import { Sku } from './sku.vo.js';

describe('Sku', () => {
  it('trims and normalizes a valid SKU', () => {
    expect(Sku.create('  ABC123  ').toString()).toBe('ABC123');
  });

  it.each([null, undefined, 'AB', 'invalid sku', 'a'.repeat(51)])(
    'rejects invalid values: %s',
    (value) => {
      expect(() => Sku.create(value)).toThrow(DomainException);
    },
  );

  it('compares SKUs by normalized value', () => {
    expect(Sku.create('ABC123').equals(Sku.create('ABC123'))).toBe(true);
    expect(Sku.create('ABC123').equals(Sku.create('XYZ789'))).toBe(false);
  });
});
