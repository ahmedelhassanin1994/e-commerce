import { Inject, Injectable } from "@nestjs/common";
import { Product } from "../../domain/entities/product.entity.js";
import{products} from "../../../shared/infrastructure/database/postgres/schema/products.schema.js";
import { ProductFilter, ProductRepository } from "../../application/ports/product.repository.js";
import { DRIZZLE } from "../../../shared/infrastructure/database/postgres/drizzle.providor.js";
import type { DrizzleDb } from "../../../shared/infrastructure/database/postgres/drizzle.providor.js";
import { Money } from "../../../shared/domain/value-objects/money.vo.js";
import { and, eq, gte, lte, SQL } from "drizzle-orm";
import { ProductId } from "../../domain/value-objects/product-id.vo.js";
import { Sku } from "../../domain/value-objects/sku.vo.js";


@Injectable()
export class DrizzleProductRepository implements ProductRepository {

    constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {
        
    }
    private static toPristineProduct(product: Product): typeof  products.$inferSelect {
        return {
            id: product.id.value,
            name:product.name,
            description:product.description,
            priceAmount: product.price.toCents(),
            priceCurrency: product.price.getCurrency(),
            isActive:product.isActive,
            lowStockThreshold: product.lowStockThreshold,
            stockQuantity: product.stock,
            sku: product.sku.toString(),
            createdAt:product.createdAt,
            updatedAt:product.updatedAt
     };
    
    }
    
    public static toDomainProduct(row: typeof products.$inferSelect): Product {{
        return Product.reconstruct({
            id:new ProductId(row.id),
            name:row.name,
            description:row?.description ??"",
            price: Money.create(row?.priceAmount ?? 0, row?.priceCurrency ?? 'USD'),
            isActive:row.isActive,
            lowStockThreshold:row.lowStockThreshold,
            stock:row.stockQuantity,
            sku: Sku.create(row.sku),
            createdAt:row.createdAt,
            updatedAt:row.updatedAt
    
        });

    }}

  async findByName(name: string): Promise<Product | null> {
    const row = await this.db
      .select()
      .from(products)
      .where(eq(products.name, name))
      .limit(1);

    if (row.length === 0) {
      return null;
    }

    return DrizzleProductRepository.toDomainProduct(row[0]);
  }

  async findBySku(sku: Sku): Promise<Product | null> {
    const row = await this.db
      .select()
      .from(products)
      .where(eq(products.sku, sku.toString()))
      .limit(1);

    if (row.length === 0) {
      return null;
    }

    return DrizzleProductRepository.toDomainProduct(row[0]);
  }

  async findAll(filter: ProductFilter): Promise<Product[]> {
    const conditions: SQL[]=[];
    if (filter.isActive !== undefined) {
      conditions.push(eq(products.isActive, filter.isActive));
    }
    if (filter.minPrice !== undefined) {
      conditions.push(gte(products.priceAmount, filter.minPrice * 100));
    }
    if (filter.maxPrice !== undefined) {
      conditions.push(lte(products.priceAmount, filter.maxPrice * 100));
    }

    const query = this.db.select().from(products);
    const productrows = conditions.length > 0
      ? await query.where(and(...conditions))
      : await query;
    return productrows.map(DrizzleProductRepository.toDomainProduct);
  }

  async findById(id: Parameters<ProductRepository["findById"]>[0]): Promise<Product | null> {
    const row = await this.db
      .select()
      .from(products)
      .where(eq(products.id, id.value))
      .limit(1);
    if (row.length === 0) {
      return null;
    }
    return DrizzleProductRepository.toDomainProduct(row[0]);
  }

  async create(product: Product): Promise<void> {
    const row=DrizzleProductRepository.toPristineProduct(product);
    await this.db.insert(products).values(row).onConflictDoUpdate({
        target: products.id,
        set: {
            name: row.name,
            description: row.description,
            priceAmount: row.priceAmount,
            priceCurrency: row.priceCurrency,
            isActive: row.isActive,
            lowStockThreshold: row.lowStockThreshold,
            stockQuantity: row.stockQuantity,
            sku: row.sku,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
        }
    });

  }

  async update(product: Product): Promise<void> {
    // Implementation for updating an existing product
  }

  async delete(id: ProductId): Promise<void> {
    await this.db.delete(products).where(eq(products.id, id.value));
  }

  

}