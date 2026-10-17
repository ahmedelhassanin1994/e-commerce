import { Product } from "../../domain/entities/product.entity.js";
import { ProductId } from "../../domain/value-objects/product-id.vo.js";
import { Sku } from "../../domain/value-objects/sku.vo.js";

export const PRODUCT_REPOSITORY = Symbol("PRODUCT_REPOSITORY");
export interface ProductFilter {
    isActive?: boolean;
    minPrice?: number;
    maxPrice?: number;
}

export interface ProductRepository {
    findByName(name: string): Promise<Product | null>;
    findBySku(sku: Sku): Promise<Product | null>;
    findByName(name: string, sku: Sku): Promise<Product | null>;
    findAll(filter: ProductFilter): Promise<Product[]>;
    findById(id: ProductId): Promise<Product | null>;
    create(product: Product): Promise<void>;
    update(product: Product): Promise<void>;
    delete(id: ProductId): Promise<void>;
}