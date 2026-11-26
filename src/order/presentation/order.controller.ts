import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PlaceOrderCommand } from '../application/use-cases/place-order/place-order.command.js';
import { PlaceOrderDto } from './dtos/place-order.dto.js';
import { OrderResponseDto } from './dtos/order-response.dto.js';
import { ListOrdersQuery } from '../application/querys/list-orders.query.js';
import { Order } from '../domain/entities/order.entity.js';
import { getOrderQuery } from '../application/querys/get-order.query.js';
import { ConfirmOrderCommand } from '../application/use-cases/confirm-order/confirm-order.command.js';
import { ShipOrderDto } from './dtos/ship-order.dto.js';
import { ShipOrderCommand } from '../application/use-cases/ship-order/ship-order.command.js';
import { DeliverOrderCommand } from '../application/use-cases/deliver-order/deliver-order.command.js';
import { CancelOrderCommand } from '../application/use-cases/cancel-order/cancel-order.command.js';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async place(@Body() dto: PlaceOrderDto): Promise<void> {
    const items = dto.itemList ?? dto.items;
    if (!items) {
      throw new BadRequestException(
        'Either items or itemList must be provided',
      );
    }

    await this.commandBus.execute<PlaceOrderCommand, void>(
      new PlaceOrderCommand(
        dto.customerId,
        items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          currency: item.currency ?? 'USD',
          quantity: item.quantity,
          discount: item.discount,
        })),
        dto.shippingStreet,
        dto.shippingCity,
        dto.shippingState,
        dto.shippingZipCode,
        dto.shippingCountry,
      ),
    );
  }

  @Get()
  async findAll(
    @Query('customerId') customerId?: string,
  ): Promise<OrderResponseDto[]> {
    const orders = await this.queryBus.execute<ListOrdersQuery, Order[]>(
      new ListOrdersQuery(customerId),
    );
    return orders.map(OrderResponseDto.fromDomain);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<OrderResponseDto> {
    const order = await this.queryBus.execute<getOrderQuery, Order>(
      new getOrderQuery(id),
    );
    return OrderResponseDto.fromDomain(order);
  }

  @Patch(':id/confirm')
  async confirm(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.commandBus.execute<ConfirmOrderCommand>(
      new ConfirmOrderCommand(id),
    );
  }

  @Patch(':id/ship')
  async ship(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ShipOrderDto,
  ) {
    await this.commandBus.execute<ShipOrderCommand, void>(
      new ShipOrderCommand(id, dto.trackingNumber.toString()),
    );
  }

  @Patch(':id/deliver')
  async deliver(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.commandBus.execute<DeliverOrderCommand, void>(
      new DeliverOrderCommand(id),
    );
  }

  @Patch(':id/cancel')
  async cancel(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('reason') reason: string,
  ) {
    await this.commandBus.execute<CancelOrderCommand, void>(
      new CancelOrderCommand(id, reason),
    );
  }
}
