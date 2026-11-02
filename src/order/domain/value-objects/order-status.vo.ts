import { DomainException } from '../../../shared/domain/excptions/domain.excption.js';

export type OrderStatusType =
  'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export class OrderStatus {
  private static readonly VALID_TRANSITIONS: Record<
    OrderStatusType,
    OrderStatusType[]
  > = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
  };

  private constructor(private readonly status: OrderStatusType) {}

  static pending(): OrderStatus {
    return new OrderStatus('pending');
  }

  static confirmed(): OrderStatus {
    return new OrderStatus('confirmed');
  }

  static shipped(): OrderStatus {
    return new OrderStatus('shipped');
  }

  static delivered(): OrderStatus {
    return new OrderStatus('delivered');
  }

  static cancelled(): OrderStatus {
    return new OrderStatus('cancelled');
  }

  static create(status: OrderStatusType): OrderStatus {
    return new OrderStatus(status);
  }

  static fromString(status: string): OrderStatus {
    const valid: OrderStatusType[] = [
      'pending',
      'confirmed',
      'shipped',
      'delivered',
      'cancelled',
    ];

    if (!valid.includes(status as OrderStatusType)) {
      throw new DomainException(`Invalid order status: ${status}`);
    }
    return new OrderStatus(status as OrderStatusType);
  }

  get value(): OrderStatusType {
    return this.status;
  }

  equals(other: OrderStatus): boolean {
    return this.status === other.status;
  }

  toString(): string {
    return this.status;
  }

  private canTransitionTo(newStatus: OrderStatus): boolean {
    const allowedTransitions = OrderStatus.VALID_TRANSITIONS[this.status];
    return allowedTransitions.includes(newStatus.value);
  }

  private transitionTo(newStatus: OrderStatus): OrderStatus {
    if (!this.canTransitionTo(newStatus)) {
      throw new DomainException(
        `Cannot transition from ${this.status} to ${newStatus.value}`,
      );
    }
    return new OrderStatus(newStatus.value);
  }

  canConfirm() {
    return this.transitionTo(OrderStatus.confirmed());
  }

  canShip(): boolean {
    return this.canTransitionTo(OrderStatus.shipped());
  }

  canDeliver(): boolean {
    return this.canTransitionTo(OrderStatus.delivered());
  }

  canCancel() {
    return this.transitionTo(OrderStatus.cancelled());
  }
}
