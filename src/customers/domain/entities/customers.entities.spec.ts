import { describe, expect, it } from 'vitest';
import { CustomerRegisteredEvent } from '../events/customer-registered.event.js';
import { Customer } from './customers.entities.js';
import { Email } from '../value-objects/email.vo.js';

describe('Customer', () => {
  it('registers an active customer and records a registration event', () => {
    const customer = Customer.register(
      Email.create('customer@example.com'),
      'Ada',
      'Lovelace',
      '555-0100',
    );

    expect(customer.getFullName()).toBe('Ada Lovelace');
    expect(customer.getEmail().getValue()).toBe('customer@example.com');
    expect(customer.getIsActive()).toBe(true);
    expect(customer.getPhone()).toBe('555-0100');
    expect(customer.getCreatedAt()).toBe(customer.getUpdatedAt());

    const [event] = customer.getUncommittedEvents();
    expect(event).toBeInstanceOf(CustomerRegisteredEvent);
    expect(event).toMatchObject({
      customerId: customer.getId().getValue(),
      email: 'customer@example.com',
      firstName: 'Ada',
    });
  });
});
