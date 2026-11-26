import { OrderItem } from '../../domain/entities/order-item.entity.js';
import { Order } from '../../domain/entities/order.entity.js';

export class OrderItemResponseDto {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  currency: string;
  quantity: number;
  discount: number | null;
  subtotal: number;

  static fromDomain(item: OrderItem): OrderItemResponseDto {
    const dto = new OrderItemResponseDto();
    dto.id = item.getId().getValue();
    dto.productId = item.productId;
    dto.productName = item.productName;
    dto.unitPrice = item.unitPrice.getAmount();
    dto.currency = item.unitPrice.getCurrency();
    dto.quantity = item.quantity;
    dto.discount = item.discount?.getAmount() ?? null;
    dto.subtotal = item.getSubtotal().getAmount();
    return dto;
  }
}

export class OrderResponseDto {
  id: string;
  customerId: string;
  status: string;
  items: OrderItemResponseDto[];
  totalAmount: number;
  totalCurrency: string;
  itemsCount: number;
  trackingNumber: string | null;
  note: string | null;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingCountry: string;
  createdAt: string;
  updatedAt: string;

  static fromDomain(order: Order): OrderResponseDto {
    const dto = new OrderResponseDto();
    const totalAmount = order.getTotal();
    dto.id = order.id.getValue();
    dto.customerId = order.customerId;
    dto.status = order.status.toString();
    dto.items = order.items.map((item: OrderItem) =>
      OrderItemResponseDto.fromDomain(item),
    );
    dto.totalAmount = totalAmount.getAmount();
    dto.totalCurrency = totalAmount.getCurrency();
    dto.itemsCount = order.getItemsCount();
    dto.trackingNumber = order.trackingNumber ?? null;
    dto.note = order.note ?? null;
    dto.shippingStreet = order.shippingAddress.street;
    dto.shippingCity = order.shippingAddress.city;
    dto.shippingState = order.shippingAddress.state;
    dto.shippingZipCode = order.shippingAddress.zipCode;
    dto.shippingCountry = order.shippingAddress.country;
    dto.createdAt = order.createdAt.toISOString();
    dto.updatedAt = order.updatedAt.toISOString();
    return dto;
  }
}
