import { Body, Controller, Get, Post, Query, ValidationPipe, Param, ParseUUIDPipe, Delete } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto.js";
import { ProductResponseDto } from "./dtos/product-response.dto.js";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateProductCommand } from "../application/use-cases/create-product/create-product.command.js";
import { ListProductQuery } from "../application/querys/list-product.querys.js";
import { DomainException } from "../../shared/domain/excptions/domain.excption.js";
import { GetProductQuery } from "../application/querys/get-product.query.js";
import { Product } from "../domain/entities/product.entity.js";
import { DeleteProductCommand } from "../application/use-cases/delete-product/delete-product.command.js";

@Controller('product')
export class ProductController {

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {

    }


    @Post()
    async createProduct(@Body(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })) dto: CreateProductDto): Promise<void> {
        await this.commandBus.execute<CreateProductCommand, void>(

            new CreateProductCommand(
                dto.name,
                dto.description,
                dto.price,
                dto.sku,
                dto.currency || "USD",
                dto.stock,
                true, // Assuming new products are active by default
                10 // Assuming a default low stock threshold
            ));
    }

    @Get()
    async findAll(
        @Query('isActive') isActive?: boolean,
        @Query('minPrice') minPrice?: number,
        @Query('maxPrice') maxPrice?: number,
    ): Promise<ProductResponseDto[]> {
        const query = new ListProductQuery(
            isActive !== undefined ? isActive : undefined,
            minPrice !== undefined ? minPrice : undefined,
            maxPrice !== undefined ? maxPrice : undefined
        );
        const products = await this.queryBus.execute(query);
        return products.map(ProductResponseDto.forDomain);
    }

    @Get(':id')
    async findOne(
        @Param('id', new ParseUUIDPipe()) id: string): Promise<ProductResponseDto> {
        const product = await this.queryBus.execute<GetProductQuery, Product>
            (new GetProductQuery(id));
        if (!product) {
            throw new DomainException(`Product with ID ${id} not found`);
        }
        return ProductResponseDto.forDomain(product);
    }

    @Delete(':id')
    async deleteProduct(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
        await this.commandBus.execute< DeleteProductCommand, void >
        (new DeleteProductCommand(id));
    }

}
