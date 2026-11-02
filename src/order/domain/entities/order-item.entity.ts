import { DomainException } from '../../../shared/domain/excptions/domain.excption.js';

interface OrderItemProps {
  productId: string;
  quantity: number;
  price: number;
}

export class OrderItem {
  private readonly _productId: string;
  private readonly _quantity: number;
  private readonly _price: number;

  private constructor(props: OrderItemProps) {
    this._productId = props.productId;
    this._quantity = props.quantity;
    this._price = props.price;
  }

  static create(props: OrderItemProps): OrderItem {
    if (
      !props.productId ||
      !props.productId.trim() ||
      props.productId.trim().length === 0
    ) {
      throw new DomainException(
        'Product ID is required to create an OrderItem',
      );
    }
    if (props.quantity <= 0) {
      throw new DomainException(
        'Quantity must be greater than zero to create an OrderItem',
      );
    }
    if (props.price <= 0) {
      throw new DomainException(
        'Price must be greater than zero to create an OrderItem',
      );
    }
    return new OrderItem({
      productId: props.productId.trim(),
      quantity: props.quantity,
      price: props.price,
    });
  }

  get productId(): string {
    return this._productId;
  }

  get quantity(): number {
    return this._quantity;
  }

  get price(): number {
    return this._price;
  }
}
