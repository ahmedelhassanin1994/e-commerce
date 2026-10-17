import { AggregateRoot } from "@nestjs/cqrs";
import { Money } from "../../../shared/domain/value-objects/money.vo.js";
import { ProductId } from "../value-objects/product-id.vo.js";
import { Sku } from "../value-objects/sku.vo.js";
import { DomainException } from "../../../shared/domain/excptions/domain.excption.js";


export interface ProductProps {
    id: ProductId;
    name: string;
    description: string;
    sku: Sku;
    stock: number;
    isActive: boolean;
    lowStockThreshold: number;
    price: Money;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Product extends AggregateRoot {

    private _id: ProductId;
    private _name: string;
    private _description: string;
    private _sku: Sku;
    private _stock: number;
    private _isActive: boolean;
    private _lowStockThreshold: number;
    private _createdAt: Date;
    private _updatedAt: Date;
    private _price: Money;

    constructor(props: ProductProps) {
        super();
        this._id = props.id;
        this._name = props.name;
        this._description = props.description;
        this._sku = props.sku;
        this._stock = props.stock;
        this._isActive = props.isActive;
        this._lowStockThreshold = props.lowStockThreshold;
        this._price = props.price;
        this._createdAt = props.createdAt ?? new Date();
        this._updatedAt = props.updatedAt ?? new Date();
    }

    static create(
        name: string,
        description: string,
        sku: string,
        price: number,
        currency: string,
        stock: number,
    ) {
        const now = new Date();
        const props: ProductProps = {
            id: new ProductId(),
            name:name,
            description:description,
            sku:Sku.create(sku),
            stock:stock,
            isActive:true,
            lowStockThreshold:5,
            price: Money.create(price, currency),
            createdAt: now,
            updatedAt: now
        };
        Product.validatonName(props.name);
        Product.validatonDescription(props.description);
        Product.validatonStock(props.stock);
        Product.validatonLowStockThreshold(props.lowStockThreshold);
        Product.validatonPrice(props.price);
        return new Product(props);
    }

    private static validatonName(name: string): boolean {
        if (name.length < 3 || name.length > 100) {
            throw new DomainException('Name must be between 3 and 100 characters');
        }
        return true;
    }

    private static validatonDescription(description: string): boolean {
        if (description.length < 10 || description.length > 500) {
            throw new DomainException('Description must be between 10 and 500 characters');
        }
        return true;
    }


    private static validatonStock(stock: number): boolean {
        if (stock < 0) {
            throw new DomainException('Stock cannot be negative');
        }
        return true;
    }

    private static validatonLowStockThreshold(lowStockThreshold: number): boolean {
        if (lowStockThreshold < 0) {
            throw new DomainException('Low stock threshold cannot be negative');
        }
        return true;
    }

    private static validatonPrice(price: Money): boolean {
        if (price.getAmount() < 0) {
            throw new DomainException('Price cannot be negative');
        }
        return true;
    }

    static reconstruct(props: ProductProps): Product {
        Product.validatonName(props.name);
        Product.validatonDescription(props.description);
        Product.validatonStock(props.stock);
        Product.validatonLowStockThreshold(props.lowStockThreshold);
        Product.validatonPrice(props.price);
        return new Product(props);
    }

    get id(): ProductId {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get sku(): Sku {
        return this._sku;
    }

    get stock(): number {
        return this._stock;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    get lowStockThreshold(): number {
        return this._lowStockThreshold;
    }

    get price(): Money {
        return this._price;
    }   

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }



}