import { BadRequestException, ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command.js';
import { PRODUCT_REPOSITORY, ProductRepository } from '../../ports/product.repository.js';
import { Product } from '../../../domain/entities/product.entity.js';
import { Sku } from '../../../domain/value-objects/sku.vo.js';
import { ApplicationException, ApplicationExceptionType } from '../../../../shared/domain/excptions/application.excptions.js';


@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler< CreateProductCommand,void> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<void> {
    if (!command.sku || !Sku.isValid(command.sku)) {
      throw new BadRequestException('SKU is required and must be 3-50 uppercase letters/numbers');
    }

    const existingBySku = await this.productRepository.findBySku(
      Sku.create(command.sku),
    );
    if (existingBySku) {
      throw new ApplicationException(`Product with SKU ${command.sku} already exists`, ApplicationExceptionType.CONFLICT_ERROR);
    }

    const existingByName = await this.productRepository.findByName(
      command.name,
    );
    if (existingByName) {
      throw new ApplicationException(`Product with name ${command.name} already exists`, ApplicationExceptionType.CONFLICT_ERROR);
    }

    const product = Product.create(
      command.name,
      command.description,
      command.sku,
      command.price,
      command.currency,
      command.stock,
    );
    await this.productRepository.create(product);
  }
}