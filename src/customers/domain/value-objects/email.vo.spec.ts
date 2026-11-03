import { describe, expect, it } from 'vitest';
import { DomainException } from '../../../shared/domain/excptions/domain.excption.js';
import { Email } from './email.vo.js';

describe('Email', () => {
  it('creates an email from a valid address', () => {
    expect(Email.create('customer@example.com').getValue()).toBe(
      'customer@example.com',
    );
  });

  it('trims whitespace from the address', () => {
    expect(Email.create('  customer@example.com  ').getValue()).toBe(
      'customer@example.com',
    );
  });

  it.each(['', '   '])('rejects an empty address: %j', (value) => {
    expect(() => Email.create(value)).toThrow(DomainException);
  });

  it('rejects an address with an invalid format', () => {
    expect(() => Email.create('not-an-email')).toThrow(DomainException);
  });
});
