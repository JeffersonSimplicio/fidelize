import { DeleteCustomer } from "@/core/application/interfaces/customers";
import { DeleteCustomerUseCase } from "@/core/application/use-cases";
import { makeCustomerRepositoryDrizzle } from "@/core/factories/repositories";

export function makeDeleteCustomer(): DeleteCustomer {
  const customerRepo = makeCustomerRepositoryDrizzle();
  return new DeleteCustomerUseCase({ customerRepo })
}