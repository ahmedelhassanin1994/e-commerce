import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PRODUCT_REPOSITORY, ProductRepository } from "../../ports/product.repository.js";
import { Product } from "../../../domain/entities/product.entity.js";
import { ProductId } from "../../../domain/value-objects/product-id.vo.js";
import { DomainException } from "../../../../shared/domain/excptions/domain.excption.js";
import { ApplicationException, ApplicationExceptionType } from "../../../../shared/domain/excptions/application.excptions.js";
import { DeleteProductCommand } from "./delete-product.command.js";

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: ProductRepository) {}

    async execute(command: DeleteProductCommand): Promise<void> {
        const product = await this.productRepository.findById(new ProductId(command.id));

        if (!product) {
            throw new ApplicationException(`Product with id ${command.id} not found`,
                 ApplicationExceptionType.NOT_FOUND_ERROR);
        }

        await this.productRepository.delete(new ProductId(command.id));
    }
}