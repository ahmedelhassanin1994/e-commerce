import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { describe, expect, it, vi } from 'vitest';
import { Order } from '../domain/entities/order.entity.js';
import { OrderId } from '../domain/value-objects/order-id.vo.js';
import { OrderStatus } from '../domain/value-objects/order-status.vo.js';
import { ShippingAddress } from '../domain/value-objects/shipping-address.vo.js';
import { OrderController } from './order.controller.js';

describe('OrderController', () => {
  it('returns a DTO for one order', async () => {
    const id = '3023df71-40a0-4f10-9682-fc6c7e8737d3';
    const now = new Date();
    const order = Order.reconstitute({
      id: new OrderId(id),
      customerId: 'customer-id',
      status: OrderStatus.pending(),
      items: [],
      shippingAddress: ShippingAddress.create({
        street: '1 Main St',
        city: 'Test City',
        state: 'CA',
        zipCode: '12345',
        country: 'US',
      }),
      trackingNumber: null,
      note: null,
      createdAt: now,
      updatedAt: now,
    });
    const queryBus = { execute: vi.fn().mockResolvedValue(order) };
    const moduleRef = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        { provide: CommandBus, useValue: { execute: vi.fn() } },
        { provide: QueryBus, useValue: queryBus },
      ],
    }).compile();

    try {
      const controller = moduleRef.get(OrderController);
      await expect(controller.findOne(id)).resolves.toMatchObject({
        id,
        customerId: 'customer-id',
        status: 'pending',
      });
    } finally {
      await moduleRef.close();
    }
  });
});
