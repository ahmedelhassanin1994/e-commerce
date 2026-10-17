import { Inject, NotFoundException } from "@nestjs/common";
import { GetProductQuery } from "../get-product.query.js";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PRODUCT_REPOSITORY, ProductRepository } from "../../ports/product.repository.js";
import { Product } from "../../../domain/entities/product.entity.js";
import { ProductId } from "../../../domain/value-objects/product-id.vo.js";
import { DomainException } from "../../../../shared/domain/excptions/domain.excption.js";
import { ApplicationException, ApplicationExceptionType } from "../../../../shared/domain/excptions/application.excptions.js";

@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<GetProductQuery> {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: ProductRepository) {}

    async execute(query: GetProductQuery): Promise<Product> {
        const { id } = query;
        const product = await this.productRepository.findById(new ProductId(id));

        if (!product) {
            throw new ApplicationException(`Product with id ${id} not found`,
                 ApplicationExceptionType.NOT_FOUND_ERROR);
        }

        return product;
    }
}