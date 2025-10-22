import { ListCustomers } from "@/core/application/interfaces/customers";
import { ListCustomersUseCase } from "@/core/application/use-cases/customers";
import { makeCustomerQueryRepositoryDrizzle } from "@/core/factories/repositories";
import { CustomerEntityToDtoMapper } from "@/core/infrastructure/mappers";

export function makeListCustomers(): ListCustomers {
  const customerQueryRepo = makeCustomerQueryRepositoryDrizzle();
  const customerEntityToDtoMapper = new CustomerEntityToDtoMapper();
  return new ListCustomersUseCase({
    customerQueryRepo: customerQueryRepo,
    customerToDtoMapper: customerEntityToDtoMapper,
  });
} 