import { Collection, Db } from "mongodb";
import { ProductFilter, ProductRepository } from "../../application/ports/product.repository.js";
import { MONGO_DB } from "../../../shared/infrastructure/database/mongodb/mongo.provider.js";
import { Inject } from "@nestjs/common";
import { Product } from "../../domain/entities/product.entity.js";
import { ProductId } from "../../domain/value-objects/product-id.vo.js";
import { Sku } from "../../domain/value-objects/sku.vo.js";
import { Money } from "../../../shared/domain/value-objects/money.vo.js";


interface PeoductDocument {
    _id: string;
    name: string;
    description: string;    
    sku: string;
    priceAmount: number;
    priceCurrency: string;
    stock: number;
    isActive: boolean;
    lowStockThreshold: number;
    createdAt: Date;
    updatedAt: Date;
}

export class MongoProductRepository implements ProductRepository {

    private readonly collection: Collection<PeoductDocument>;

   constructor(@Inject( MONGO_DB) db: Db) {
    this.collection = db.collection<PeoductDocument>('products');
    
    }
   
    update(product: Product): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private static toPresentation(product: Product): PeoductDocument {
        return {
            _id: product.id.value,
            name: product.name,
            description: product.description,
            sku: product.sku.getValue(),
            priceAmount: product.price.toCents() ?? 0,
            priceCurrency: product.price?.getCurrency() ?? "",
            stock: product.stock,
            isActive: product.isActive,
            lowStockThreshold: product.lowStockThreshold,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        };
    
    }

   async create(product: Product): Promise<void> {
        const document = MongoProductRepository.toPresentation(product);
        await this.collection.insertOne(document);
    }

    async findById(id: ProductId): Promise<Product | null> {
        const document = await this.collection.findOne({ _id: id.value });
        if (!document) {
            return null;
        }
        return MongoProductRepository.toDomain(document);
    }

    async findBySku(sku: Sku): Promise<Product | null> {
        const document = await this.collection.findOne({ sku: sku.getValue() });
        if (!document) {
            return null;
        }
        return MongoProductRepository.toDomain(document);
    }

    async findAll(filter: ProductFilter): Promise<Product[]> {
        const query:any = {};
        if(filter.isActive !== undefined) {
            query.isActive = filter.isActive;
        }
        if(filter.minPrice !== undefined || filter.maxPrice !== undefined) {
            query.priceAmount = {};
            if(filter.minPrice !== undefined) {
                query.priceAmount.$gte = Math.round(filter.minPrice * 100); // Convert to cents
            }
            if(filter.maxPrice !== undefined) {
                query.priceAmount.$lte = Math.round(filter.maxPrice * 100); // Convert to cents
            }
        }
        const documents = await this.collection.find(query).toArray();
        return documents.map(MongoProductRepository.toDomain);
    }

    async delete(id: ProductId): Promise<void> {
        await this.collection.deleteOne({ _id: id.value });
    }

    async findByName(name: string): Promise<Product | null> {
        const document = await this.collection.findOne({ name });
        if (!document) {
            return null;
        }
        return MongoProductRepository.toDomain(document);
    }

    private static toDomain(document: PeoductDocument): Product {
        return new Product({
            id: new ProductId(document._id),
            name: document.name,
            description: document.description,
            sku: Sku.create(document.sku),
            price: Money.fromCents(document.priceAmount /100, document.priceCurrency),
            stock: document.stock,
            isActive: document.isActive,
            lowStockThreshold: document.lowStockThreshold,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt
        });
    }

  
  
}