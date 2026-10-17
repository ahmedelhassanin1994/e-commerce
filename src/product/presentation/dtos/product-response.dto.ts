import { Product } from "../../domain/entities/product.entity.js";

export class ProductResponseDto {  
    id: string;     
    name: string;
    description: string;
    price: number;
    sku: string;
    currency: string;
    stock: number;
    isActive: boolean;
    lowStockThreshold: number;
    createdAt: string;
    updatedAt: string;

    static forDomain(product: Product): ProductResponseDto {
        const dto = new ProductResponseDto();
        dto.id = product.id.toString();
        dto.name = product.name;
        dto.description = product.description;
        dto.price = product.price.getAmount();
        dto.sku = product.sku.getValue();
        dto.currency = product.price.getCurrency();
        dto.stock = product.stock;
        dto.isActive = product.isActive;
        dto.lowStockThreshold = product.lowStockThreshold;
        dto.createdAt = product.createdAt.toString();
        dto.updatedAt = product.updatedAt.toString();
        return dto;
     }
     }