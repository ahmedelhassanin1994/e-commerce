import { CancelOrderHandler } from './use-cases/cancel-order/cancel-order.handler.js';
import { ConfirmOrderHandler } from './use-cases/confirm-order/confirm-order.handler.js';
import { DeliverOrderHandler } from './use-cases/deliver-order/deliver-order.handler.js';
import { PlaceOrderHandler } from './use-cases/place-order/place-order.handler.js';
import { ShipOrderHandlers } from './use-cases/ship-order/ship-order.handler.js';

export const CommandHandlers = [
  PlaceOrderHandler,
  ConfirmOrderHandler,
  ShipOrderHandlers,
  DeliverOrderHandler,
  CancelOrderHandler,
];
