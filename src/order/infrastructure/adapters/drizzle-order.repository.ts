import { Inject, Injectable } from '@nestjs/common';
import { OrderRepositoryPort } from '../../domain/ports/order.repository.port.js';
import { Order } from '../../domain/entities/order.entity.js';
import {
  orderItems,
  orders,
} from '../../../shared/infrastructure/database/postgres/schema/order.schema.js';
import {
  DRIZZLE,
  DrizzleDb,
} from '../../../shared/infrastructure/database/postgres/drizzle.providor.js';
import { OrderId } from '../../domain/value-objects/order-id.vo.js';
import { OrderStatus } from '../../domain/value-objects/order-status.vo.js';
import { ShippingAddress } from '../../domain/value-objects/shipping-address.vo.js';
import { OrderItem } from '../../domain/entities/order-item.entity.js';
import { and, eq, notInArray } from 'drizzle-orm/sql/expressions/conditions';
import { Money } from '../../../shared/domain/value-objects/money.vo.js';
import { UniqueId } from '../../../shared/domain/value-objects/unique-entity-id.js';

@Injectable()
export class DrizzleOrderRepository implements OrderRepositoryPort {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: DrizzleDb,
  ) {}

  async save(order: Order): Promise<void> {
    const orderRow = DrizzleOrderRepository.toOrderPersistence(order);
    const itemRows: Array<typeof orderItems.$inferInsert> = order.items.map(
      (item: OrderItem) =>
        DrizzleOrderRepository.toItemPersistence(item, order.id.getValue()),
    );

    await this.db.transaction(async (tx) => {
      await tx
        .insert(orders)
        .values(orderRow)
        .onConflictDoUpdate({
          target: orders.id,
          set: {
            status: orderRow.status,
            totalAmount: orderRow.totalAmount,
            totalCurrency: orderRow.totalCurrency,
            shippingStreet: orderRow.shippingStreet,
            shippingCity: orderRow.shippingCity,
            shippingState: orderRow.shippingState,
            shippingZipCode: orderRow.shippingZipCode,
            shippingCountry: orderRow.shippingCountry,
            trackingNumber: orderRow.trackingNumber,
            notes: orderRow.notes,
            updatedAt: orderRow.updatedAt,
          },
        });

      for (const itemRow of itemRows) {
        await tx
          .insert(orderItems)
          .values(itemRow)
          .onConflictDoUpdate({
            target: orderItems.id,
            set: {
              productName: itemRow.productName,
              unitPriceAmount: itemRow.unitPriceAmount,
              unitPriceCurrency: itemRow.unitPriceCurrency,
              quantity: itemRow.quantity,
              discountAmount: itemRow.discountAmount,
              discountCurrency: itemRow.discountCurrency,
            },
          });
      }

      const currentItemIds = itemRows.map((r) => r.id);
      if (currentItemIds.length > 0) {
        await tx
          .delete(orderItems)
          .where(
            and(
              eq(orderItems.orderId, order.id.getValue()),
              notInArray(orderItems.id, currentItemIds),
            ),
          );
      } else {
        await tx
          .delete(orderItems)
          .where(eq(orderItems.orderId, order.id.getValue()));
      }
    });
  }

  async findOrderById(id: OrderId): Promise<Order | null> {
    const reuslt = await this.db.query.orders.findFirst({
      where: (orders, { eq }) => eq(orders.id, id.getValue()),
      with: {
        items: true,
      },
    });
    if (!reuslt) {
      return null;
    }
    const order = DrizzleOrderRepository.toDomain(reuslt, reuslt.items);
    return order;
  }

  async findOrdersByCustomerId(customerId: string): Promise<Order[]> {
    const result = await this.db.query.orders.findMany({
      where: (orders, { eq }) => eq(orders.customerId, customerId),
      with: {
        items: true,
      },
    });
    return result.map((r) => DrizzleOrderRepository.toDomain(r, r.items));
  }

  async findAllOrders(): Promise<Order[]> {
    const result = await this.db.query.orders.findMany({
      with: {
        items: true,
      },
    });
    return result.map((r) => DrizzleOrderRepository.toDomain(r, r.items));
  }

  deleteOrder(id: OrderId): Promise<void> {
    return this.db.transaction(async (tx) => {
      await tx.delete(orderItems).where(eq(orderItems.orderId, id.getValue()));
      await tx.delete(orders).where(eq(orders.id, id.getValue()));
    });
  }

  private static toOrderPersistence(order: Order): typeof orders.$inferInsert {
    const total = order.getTotal();
    return {
      id: order.id.getValue(),
      customerId: order.customerId,
      status: order.status.getValue(),
      totalAmount: total.toCents(),
      totalCurrency: total.getCurrency(),
      shippingStreet: order.shippingAddress.street,
      shippingCity: order.shippingAddress.city,
      shippingState: order.shippingAddress.state,
      shippingCountry: order.shippingAddress.country,
      shippingZipCode: order.shippingAddress.zipCode,
      trackingNumber: order.trackingNumber,
      notes: order.note,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
  private static toItemPersistence(
    item: OrderItem,
    orderId: string,
  ): typeof orderItems.$inferInsert {
    return {
      id: item.getId().getValue(),
      orderId,
      productId: item.productId,
      productName: item.productName,
      unitPriceAmount: item.unitPrice.toCents(),
      unitPriceCurrency: item.unitPrice.getCurrency(),
      quantity: item.quantity,
      discountAmount: item.discount?.toCents() ?? null,
      discountCurrency: item.discount?.getCurrency() ?? null,
      createdAt: new Date(),
    };
  }

  private static toDomain(
    orderRow: typeof orders.$inferSelect,
    itemsRow: (typeof orderItems.$inferSelect)[],
  ): Order {
    const items = itemsRow.map((itemRow) => {
      const unitPrice = Money.create(
        itemRow.unitPriceAmount / 100,
        itemRow.unitPriceCurrency,
      );
      const discount =
        itemRow.discountAmount && itemRow.discountCurrency
          ? Money.create(itemRow.discountAmount, itemRow.discountCurrency)
          : null;

      return OrderItem.reconstitute({
        id: new UniqueId(itemRow.id),
        productId: itemRow.productId,
        productName: itemRow.productName,
        unitPrice,
        quantity: itemRow.quantity,
        discount,
      });
    });

    const shippingAddress = ShippingAddress.create({
      street: orderRow.shippingStreet ?? '',
      city: orderRow.shippingCity ?? '',
      state: orderRow.shippingState ?? '',
      zipCode: orderRow.shippingZipCode ?? '',
      country: orderRow.shippingCountry ?? '',
    });

    return Order.reconstitute({
      id: new OrderId(orderRow.id),
      customerId: orderRow.customerId,
      status: OrderStatus.fromString(orderRow.status),
      items,
      shippingAddress,
      trackingNumber: orderRow.trackingNumber,
      note: orderRow.notes,
      createdAt: orderRow.createdAt,
      updatedAt: orderRow.updatedAt,
    });
  }
}
