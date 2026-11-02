import { describe, expect, it } from 'vitest';
import { DomainException } from '../excptions/domain.excption.js';
import { Money } from './money.vo.js';

describe('Money', () => {
  it('normalizes currency and amount to two decimal places', () => {
    const money = Money.create(12.349, 'usd');

    expect(money.getAmount()).toBe(12.34);
    expect(money.getCurrency()).toBe('USD');
  });

  it('rejects negative amounts', () => {
    expect(() => Money.create(-1)).toThrow(DomainException);
  });

  it('adds and subtracts amounts in the same currency', () => {
    const total = Money.create(10).add(Money.create(2.5));

    expect(total.getAmount()).toBe(12.5);
    expect(total.toCents()).toBe(1250);
    expect(total.subtract(Money.create(2.5)).getAmount()).toBe(10);
  });

  it('rejects arithmetic across currencies and negative results', () => {
    expect(() => Money.create(5).add(Money.create(1, 'EUR'))).toThrow(
      DomainException,
    );
    expect(() => Money.create(1).subtract(Money.create(2))).toThrow(
      DomainException,
    );
  });

  it('converts to and from cents', () => {
    const money = Money.fromCents(1234, 'eur');

    expect(money.getAmount()).toBe(12.34);
    expect(money.getCurrency()).toBe('EUR');
    expect(Money.create(12.34, 'EUR').equals(money)).toBe(true);
  });
});
