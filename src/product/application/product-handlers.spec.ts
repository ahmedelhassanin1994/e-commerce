import { BadRequestException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { ApplicationException } from '../../shared/domain/excptions/application.excptions.js';
import { Product } from '../domain/entities/product.entity.js';
import { ProductId } from '../domain/value-objects/product-id.vo.js';
import { Sku } from '../domain/value-objects/sku.vo.js';
import type { ProductRepository } from './ports/product.repository.js';
import { CreateProductCommand } from './use-cases/create-product/create-product.command.js';
import { CreateProductHandler } from './use-cases/create-product/create-product.handler.js';
import { DeleteProductCommand } from './use-cases/delete-product/delete-product.command.js';
import { DeleteProductHandler } from './use-cases/delete-product/delete-product.handele.js';
import { GetProductQuery } from './querys/get-product.query.js';
import { GetProductHandler } from './querys/handlers/get-product.handler.js';
import { ListProductQuery } from './querys/list-product.querys.js';
import { ListProductHandler } from './querys/handlers/list-product.handler.js';

function createProductRepository(): ProductRepository {
  return {
    findByName: vi.fn(
      async (_name: string, _sku?: Sku): Promise<Product | null> => null,
    ),
    findBySku: vi.fn(async (_sku: Sku): Promise<Product | null> => null),
    findAll: vi.fn(async (): Promise<Product[]> => []),
    findById: vi.fn(async (_id: ProductId): Promise<Product | null> => null),
    create: vi.fn(async (_product: Product) => {}),
    update: vi.fn(async (_product: Product) => {}),
    delete: vi.fn(async (_id: ProductId) => {}),
  };
}

function createProductCommand(
  overrides: Partial<CreateProductCommand> = {},
): CreateProductCommand {
  return new CreateProductCommand(
    overrides.name ?? 'Mechanical Keyboard',
    overrides.description ?? 'A durable keyboard for daily use.',
    overrides.price ?? 89.99,
    overrides.sku ?? 'KEYBOARD01',
    overrides.currency ?? 'USD',
    overrides.stock ?? 12,
    overrides.isActive ?? true,
    overrides.lowStockThreshold ?? 5,
  );
}

function createProduct(): Product {
  return Product.create(
    'Mechanical Keyboard',
    'A durable keyboard for daily use.',
    'KEYBOARD01',
    89.99,
    'USD',
    12,
  );
}

describe('product application handlers', () => {
  it('creates a product after checking SKU and name uniqueness', async () => {
    const repository = createProductRepository();
    const handler = new CreateProductHandler(repository);

    await handler.execute(createProductCommand());

    expect(repository.findBySku).toHaveBeenCalledWith(Sku.create('KEYBOARD01'));
    expect(repository.findByName).toHaveBeenCalledWith('Mechanical Keyboard');
    expect(repository.create).toHaveBeenCalledOnce();
  });

  it('rejects invalid SKUs before querying the repository', async () => {
    const repository = createProductRepository();
    const handler = new CreateProductHandler(repository);

    await expect(
      handler.execute(createProductCommand({ sku: 'bad sku' })),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(repository.findBySku).not.toHaveBeenCalled();
  });

  it('rejects a duplicate SKU without creating a product', async () => {
    const repository = createProductRepository();
    vi.mocked(repository.findBySku).mockResolvedValue(createProduct());
    const handler = new CreateProductHandler(repository);

    await expect(
      handler.execute(createProductCommand()),
    ).rejects.toBeInstanceOf(ApplicationException);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('rejects a duplicate product name without creating a product', async () => {
    const repository = createProductRepository();
    vi.mocked(repository.findByName).mockResolvedValue(createProduct());
    const handler = new CreateProductHandler(repository);

    await expect(
      handler.execute(createProductCommand()),
    ).rejects.toBeInstanceOf(ApplicationException);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('returns the requested product', async () => {
    const repository = createProductRepository();
    const product = createProduct();
    vi.mocked(repository.findById).mockResolvedValue(product);
    const handler = new GetProductHandler(repository);

    await expect(
      handler.execute(new GetProductQuery(product.id.toString())),
    ).resolves.toBe(product);
  });

  it('rejects a product query when the product does not exist', async () => {
    const handler = new GetProductHandler(createProductRepository());

    await expect(
      handler.execute(new GetProductQuery('missing-id')),
    ).rejects.toBeInstanceOf(ApplicationException);
  });

  it('passes product filters through to the repository', async () => {
    const repository = createProductRepository();
    const products = [createProduct()];
    vi.mocked(repository.findAll).mockResolvedValue(products);
    const handler = new ListProductHandler(repository);
    const query = new ListProductQuery(true, 10, 100);

    await expect(handler.execute(query)).resolves.toBe(products);
    expect(repository.findAll).toHaveBeenCalledWith({
      isActive: true,
      minPrice: 10,
      maxPrice: 100,
    });
  });

  it('deletes an existing product by its ID', async () => {
    const repository = createProductRepository();
    const product = createProduct();
    vi.mocked(repository.findById).mockResolvedValue(product);
    const handler = new DeleteProductHandler(repository);

    await handler.execute(new DeleteProductCommand(product.id.toString()));

    expect(repository.delete).toHaveBeenCalledWith(product.id);
  });

  it('does not delete a product that cannot be found', async () => {
    const repository = createProductRepository();
    const handler = new DeleteProductHandler(repository);

    await expect(
      handler.execute(new DeleteProductCommand('missing-id')),
    ).rejects.toBeInstanceOf(ApplicationException);
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
