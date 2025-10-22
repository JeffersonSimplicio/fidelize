import { ListTopCustomersByPoints } from "@/core/application/interfaces/customers";
import { ListTopCustomersByPointsUseCase } from "@/core/application/use-cases/customers";
import { makeCustomerQueryRepositoryDrizzle } from "@/core/factories/repositories";
import { CustomerEntityToDtoMapper } from "@/core/infrastructure/mappers";

export function makeListTopCustomersByPoints(): ListTopCustomersByPoints {
  const customerQueryRepo = makeCustomerQueryRepositoryDrizzle();
  const customerEntityToDtoMapper = new CustomerEntityToDtoMapper();
  return new ListTopCustomersByPointsUseCase({
    customerQueryRepo: customerQueryRepo,
    customerToDtoMapper: customerEntityToDtoMapper
  });
}