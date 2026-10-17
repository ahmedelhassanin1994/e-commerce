import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { ProductController } from "./presentation/product.controller.js";
import { DrizzleProductRepository } from "./infrastructure/adapters/drizzle-product.repository.js";
import { CommandHandlers } from "./application/indext.js";
import { PRODUCT_REPOSITORY } from "./application/ports/product.repository.js";
import { QueryHandlers } from "./application/querys/handlers/index.js";
import { ConfigService } from "@nestjs/config";
import { MongoProductRepository } from "./infrastructure/adapters/mongo-product.repository.js";

@Module({
    imports: [CqrsModule.forRoot()],
    controllers: [
        ProductController
    ],
    providers: [
        ...CommandHandlers,
        ...QueryHandlers,
        MongoProductRepository,
        DrizzleProductRepository,
        {
            provide: PRODUCT_REPOSITORY,
            useFactory: (configService: ConfigService ,mongoRepo: MongoProductRepository, drizzleRepo: DrizzleProductRepository ) => {
                return configService.get('DATABASE') === 'mongodb' ?
                    mongoRepo :
                    drizzleRepo;

            },
            inject: [ConfigService, MongoProductRepository, DrizzleProductRepository]
        }
    ],
})
export class ProductModule { }