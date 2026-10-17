import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ListProductQuery } from "../list-product.querys.js";
import { Inject } from "@nestjs/common";
import { PRODUCT_REPOSITORY, ProductRepository } from "../../ports/product.repository.js";
import { Product } from "../../../domain/entities/product.entity.js";

@QueryHandler(ListProductQuery)
export class ListProductHandler implements IQueryHandler<ListProductQuery, Product[]> {


    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: ProductRepository

    ) {

    }

    async execute(query: ListProductQuery): Promise<Product[]> {
        const products = await this.productRepository.findAll({
            isActive: query.isActive,
            minPrice: query.minPrice,
            maxPrice: query.maxPrice
        }
        );
        return products;
    }

}