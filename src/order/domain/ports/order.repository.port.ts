import { Order } from '../entities/order.entity.js';
import { OrderId } from '../value-objects/order-id.vo.js';

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');

export interface OrderRepositoryPort {
  save(order: Order): Promise<void>;
  findOrderById(id: OrderId): Promise<Order | null>;
  findOrdersByCustomerId(customerId: string): Promise<Order[]>;
  findAllOrders(): Promise<Order[]>;
  deleteOrder(id: OrderId): Promise<void>;
}
