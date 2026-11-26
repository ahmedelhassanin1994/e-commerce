import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { PlaceOrderDto } from './place-order.dto.js';

const orderDetails = {
  customerId: 'adab1de4-0e21-4b8b-b43b-e119e323c91d',
  shippingCity: 'cairo',
  shippingStreet: 'ahmed',
  shippingState: 'cairo',
  shippingCountry: 'EG',
  shippingZipCode: '234',
};

describe('PlaceOrderDto', () => {
  it.each(['itemList', 'items'] as const)(
    'accepts a discount in the nested %s field',
    (itemsField) => {
      const dto = plainToInstance(PlaceOrderDto, {
        ...orderDetails,
        [itemsField]: [
          {
            productId: '7db298dd-a1dc-43b4-8ebe-f42d5ad5d2bb',
            productName: 'iPhone 16',
            unitPrice: 79999,
            quantity: 2,
            discount: 5,
          },
        ],
      });

      expect(
        validateSync(dto, {
          whitelist: true,
          forbidNonWhitelisted: true,
        }),
      ).toEqual([]);
    },
  );
});
