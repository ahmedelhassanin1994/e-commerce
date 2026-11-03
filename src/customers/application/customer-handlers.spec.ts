import { describe, expect, it, vi } from 'vitest';
import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { ApplicationException } from '../../shared/domain/excptions/application.excptions.js';
import { Customer } from '../domain/entities/customers.entities.js';
import { Email } from '../domain/value-objects/email.vo.js';
import { CustomerId } from '../domain/value-objects/customer-id.vo.js';
import { CustomerRegisteredEvent } from '../domain/events/customer-registered.event.js';
import type { CustomerRepositoryPort } from './ports/customer.repository.js';
import type { NotificationPort } from './ports/notification.ports.js';
import { CustomersRegisteredHandler } from './events/customers-registered.handler.js';
import { DeleteCustomerCommand } from './use-case/delete-customer/delete-customer.command.js';
import { DeleteCustomerHandler } from './use-case/delete-customer/delete-customer.handler.js';
import { RegisterCustomerCommand } from './use-case/register-customer/register-customer.command.js';
import { RegisterCustomerHandler } from './use-case/register-customer/register-customer.handler.js';
import { GetCustomerQuery } from './queries/get-customer.query.js';
import { GetCustomerHandler } from './queries/handlers/get-customer.handler.js';
import { ListCustomersQuery } from './queries/list-customers.query.js';
import { ListCustomersHandler } from './queries/handlers/list-customers.handler.js';

function createCustomerRepository(): CustomerRepositoryPort {
  return {
    save: vi.fn(async (_customer: Customer) => {}),
    findById: vi.fn(async (_id: CustomerId): Promise<Customer | null> => null),
    findByEmail: vi.fn(async (_email: Email): Promise<Customer | null> => null),
    findAll: vi.fn(async (): Promise<Customer[]> => []),
    delete: vi.fn(async (_id: CustomerId) => {}),
  };
}

function createCustomer(): Customer {
  return Customer.register(
    Email.create('customer@example.com'),
    'Ada',
    'Lovelace',
    '555-0100',
  );
}

async function createEventPublisher() {
  const moduleRef = await Test.createTestingModule({
    imports: [CqrsModule],
  }).compile();

  return {
    eventPublisher: moduleRef.get(EventPublisher),
    moduleRef,
  };
}

describe('customer application handlers', () => {
  it('registers and saves a customer, then commits its event', async () => {
    const repository = createCustomerRepository();
    const { eventPublisher, moduleRef } = await createEventPublisher();
    const mergeObjectContext = vi.spyOn(eventPublisher, 'mergeObjectContext');
    const commit = vi.spyOn(Customer.prototype, 'commit');

    try {
      const handler = new RegisterCustomerHandler(repository, eventPublisher);
      await handler.execute(
        new RegisterCustomerCommand(
          'Ada',
          'Lovelace',
          'customer@example.com',
          '555-0100',
        ),
      );

      expect(repository.findByEmail).toHaveBeenCalledWith(
        Email.create('customer@example.com'),
      );
      expect(repository.save).toHaveBeenCalledOnce();
      expect(mergeObjectContext).toHaveBeenCalledOnce();
      expect(commit).toHaveBeenCalledOnce();
    } finally {
      await moduleRef.close();
    }
  });

  it('rejects duplicate customer emails without saving', async () => {
    const repository = createCustomerRepository();
    vi.mocked(repository.findByEmail).mockResolvedValue(createCustomer());
    const { eventPublisher, moduleRef } = await createEventPublisher();

    try {
      const handler = new RegisterCustomerHandler(repository, eventPublisher);
      await expect(
        handler.execute(
          new RegisterCustomerCommand(
            'Ada',
            'Lovelace',
            'customer@example.com',
            '555-0100',
          ),
        ),
      ).rejects.toBeInstanceOf(ApplicationException);
      expect(repository.save).not.toHaveBeenCalled();
    } finally {
      await moduleRef.close();
    }
  });

  it('deletes an existing customer by its ID', async () => {
    const repository = createCustomerRepository();
    const customer = createCustomer();
    vi.mocked(repository.findById).mockResolvedValue(customer);
    const handler = new DeleteCustomerHandler(repository);

    await handler.execute(new DeleteCustomerCommand(customer.getId().value));

    expect(repository.delete).toHaveBeenCalledWith(customer.getId());
  });

  it('does not delete a customer that cannot be found', async () => {
    const repository = createCustomerRepository();
    const handler = new DeleteCustomerHandler(repository);

    await expect(
      handler.execute(new DeleteCustomerCommand('missing-id')),
    ).rejects.toBeInstanceOf(ApplicationException);
    expect(repository.delete).not.toHaveBeenCalled();
  });

  it('returns the requested customer', async () => {
    const repository = createCustomerRepository();
    const customer = createCustomer();
    vi.mocked(repository.findById).mockResolvedValue(customer);
    const handler = new GetCustomerHandler(repository);

    await expect(
      handler.execute(new GetCustomerQuery(customer.getId().value)),
    ).resolves.toBe(customer);
  });

  it('rejects a customer query when the customer does not exist', async () => {
    const handler = new GetCustomerHandler(createCustomerRepository());

    await expect(
      handler.execute(new GetCustomerQuery('missing-id')),
    ).rejects.toBeInstanceOf(ApplicationException);
  });

  it('returns all customers', async () => {
    const repository = createCustomerRepository();
    const customers = [createCustomer()];
    vi.mocked(repository.findAll).mockResolvedValue(customers);
    const handler = new ListCustomersHandler(repository);

    await expect(handler.execute(new ListCustomersQuery())).resolves.toBe(
      customers,
    );
    expect(repository.findAll).toHaveBeenCalledOnce();
  });

  it('sends a welcome notification for a customer registration event', async () => {
    const notificationService: NotificationPort = {
      sendNotification: vi.fn(async () => {}),
    };
    const handler = new CustomersRegisteredHandler(notificationService);
    const event = new CustomerRegisteredEvent(
      'customer-id',
      'customer@example.com',
      'Ada',
    );

    await handler.handle(event);

    expect(notificationService.sendNotification).toHaveBeenCalledWith({
      recpientId: 'customer-id',
      subject: 'Welcome',
      message:
        'Hello Ada, welcome to e-commerce. Your account has been created.',
    });
  });
});
