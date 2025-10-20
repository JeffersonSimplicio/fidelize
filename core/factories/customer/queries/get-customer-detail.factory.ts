import { GetCustomerDetail } from "@/core/application/interfaces/customers";
import { GetCustomerDetailUseCase } from "@/core/application/use-cases/customers";
import { makeCustomerRepositoryDrizzle } from "@/core/factories/repositories";
import { CustomerEntityToDtoMapper } from "@/core/infrastructure/mappers";

export function makeGetCustomerDetail(): GetCustomerDetail {
  const customerRepo = makeCustomerRepositoryDrizzle();
  const mapperToDto = new CustomerEntityToDtoMapper();
  return new GetCustomerDetailUseCase(customerRepo, mapperToDto);
}