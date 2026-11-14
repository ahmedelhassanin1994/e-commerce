import { AggregateRoot } from '@nestjs/cqrs';
import { OrderId } from '../value-objects/order-id.vo.js';
import { OrderStatus } from '../value-objects/order-status.vo.js';
import { OrderItem } from './order-item.entity.js';
import { ShippingAddress } from '../value-objects/shipping-address.vo.js';
import { DomainException } from '../../../shared/domain/excptions/domain.excption.js';
import { Money } from '../../../shared/domain/value-objects/money.vo.js';

interface OrderProps {
  id: OrderId;
  customerId: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  trackingNumber: string | null;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Order extends AggregateRoot<OrderProps> {
  [x: string]: any;

  private readonly _id: OrderId;
  private _customerId: string;
  private _status: OrderStatus;
  private _items: OrderItem[];
  private _shippingAddress: ShippingAddress;
  private _trackingNumber: string | null;
  private _note: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: OrderProps) {
    super();
    this._id = props.id;
    this._customerId = props.customerId;
    this._status = props.status;
    this._items = props.items;
    this._shippingAddress = props.shippingAddress;
    this._trackingNumber = props.trackingNumber;
    this._note = props.note;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static place(
    customerId: string,
    items: OrderItem[],
    shippingAddress: ShippingAddress,
  ) {
    if (items.length === 0) {
      throw new DomainException('Order must have at least one item');
    }
    const now = new Date();
    const id = new OrderId();
    const order = new Order({
      id: id,
      customerId,
      status: OrderStatus.pending(),
      items,
      shippingAddress,
      trackingNumber: null,
      note: null,
      createdAt: now,
      updatedAt: now,
    });
    return order;
  }

  static reconstitute(props: OrderProps): Order {
    return new Order(props);
  }
  getTotal(): Money {
    return this.getSubtotal();
  }

  getSubtotal(): Money {
    if (this._items.length === 0) {
      return Money.zero();
    }
    return this._items.reduce(
      (sum, item) => sum.add(item.getSubtotal()),
      Money.zero(this._items[0].unitPrice.getCurrency()),
    );
  }

  get id(): OrderId {
    return this._id;
  }
}
