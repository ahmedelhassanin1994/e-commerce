import { Global, Module } from "@nestjs/common";
import { DrizzleProvider } from "./drizzle.providor.js";

@Global()
@Module({
  imports: [],  
  controllers: [],
  providers: [DrizzleProvider],
  exports: [DrizzleProvider],
})
export class DrizzleModule {

}