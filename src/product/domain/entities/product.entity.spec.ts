import { describe, expect, it } from 'vitest';
import { DomainException } from '../../../shared/domain/excptions/domain.excption.js';
import { Product } from './product.entity.js';

const validProduct = () =>
  Product.create(
    'Mechanical Keyboard',
    'A durable keyboard for daily use.',
    'KEYBOARD01',
    89.99,
    'usd',
    12,
  );

describe('Product', () => {
  it('creates a product with normalized value objects and defaults', () => {
    const product = validProduct();

    expect(product.name).toBe('Mechanical Keyboard');
    expect(product.sku.getValue()).toBe('KEYBOARD01');
    expect(product.price.getAmount()).toBe(89.99);
    expect(product.price.getCurrency()).toBe('USD');
    expect(product.stock).toBe(12);
    expect(product.isActive).toBe(true);
    expect(product.lowStockThreshold).toBe(5);
    expect(product.createdAt).toBeInstanceOf(Date);
    expect(product.updatedAt).toBeInstanceOf(Date);
  });

  it.each([
    ['', 'A durable keyboard for daily use.', 12],
    ['Keyboard', 'Too short', 12],
    ['Mechanical Keyboard', 'A durable keyboard for daily use.', -1],
  ])('rejects invalid product details', (name, description, stock) => {
    expect(() =>
      Product.create(name, description, 'KEYBOARD01', 89.99, 'USD', stock),
    ).toThrow(DomainException);
  });

  it('reconstructs a valid product while retaining its ID and timestamps', () => {
    const product = validProduct();
    const reconstructed = Product.reconstruct({
      id: product.id,
      name: product.name,
      description: product.description,
      sku: product.sku,
      stock: product.stock,
      isActive: product.isActive,
      lowStockThreshold: product.lowStockThreshold,
      price: product.price,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });

    expect(reconstructed.id).toBe(product.id);
    expect(reconstructed.createdAt).toBe(product.createdAt);
    expect(reconstructed.updatedAt).toBe(product.updatedAt);
  });
});
