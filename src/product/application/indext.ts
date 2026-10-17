import { CreateProductHandler } from "./use-cases/create-product/create-product.handler.js";
import { DeleteProductHandler } from "./use-cases/delete-product/delete-product.handele.js";

export const CommandHandlers = [CreateProductHandler,DeleteProductHandler];