import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongoModule } from "./shared/infrastructure/database/mongodb/mongo.module.js";
import { DrizzleModule } from "./shared/infrastructure/database/postgres/drizzle.module.js";
import { CqrsModule } from "@nestjs/cqrs";
import { ProductModule } from "./product/product.module.js";

@Module({
  imports: [
      CqrsModule.forRoot(),
      ConfigModule.forRoot({isGlobal: true},),  
      MongoModule,
      DrizzleModule,
      ProductModule
  ],  
  controllers: [],
  providers: [],
})
export class AppModule {

}