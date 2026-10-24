import { GetCustomerQuery } from "../get-customer.query.js";
import { GetCustomerHandler } from "./get-customer.handler.js";
import { ListCustomersHandler } from "./list-customers.handler.js";

export const QueryHandlers = [ListCustomersHandler,GetCustomerQuery,GetCustomerHandler];