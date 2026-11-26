import { describe, expect, it, vi } from 'vitest';
import { Order } from '../../../domain/entities/order.entity.js';
import type { OrderRepositoryPort } from '../../ports/order.repository.port.js';
import { ListOrdersQuery } from '../list-orders.query.js';
import { ListOrdersHandler } from './list-orders.handler.js';

function createOrderRepository(): OrderRepositoryPort {
  return {
    save: vi.fn(async (_order: Order) => {}),
    findById: vi.fn(async () => null),
    findByCustomerId: vi.fn(
      async (_customerId: string): Promise<Order[]> => [],
    ),
    findAll: vi.fn(async (): Promise<Order[]> => []),
    delete: vi.fn(async () => {}),
  };
}

describe('ListOrdersHandler', () => {
  it('lists orders for the requested customer', async () => {
    const repository = createOrderRepository();
    const orders: Order[] = [];
    vi.mocked(repository.findByCustomerId).mockResolvedValue(orders);
    const handler = new ListOrdersHandler(repository);

    await expect(
      handler.execute(new ListOrdersQuery('customer-id')),
    ).resolves.toBe(orders);
    expect(repository.findByCustomerId).toHaveBeenCalledWith('customer-id');
    expect(repository.findAll).not.toHaveBeenCalled();
  });

  it('lists all orders when no customer filter is provided', async () => {
    const repository = createOrderRepository();
    const orders: Order[] = [];
    vi.mocked(repository.findAll).mockResolvedValue(orders);
    const handler = new ListOrdersHandler(repository);

    await expect(handler.execute(new ListOrdersQuery())).resolves.toBe(orders);
    expect(repository.findAll).toHaveBeenCalledOnce();
    expect(repository.findByCustomerId).not.toHaveBeenCalled();
  });
});
