import { CustomerRewardRepository } from "@/core/domain/customer-rewards/customer-reward.repository.interface";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { customerRewards } from '@/core/infrastructure/database/drizzle/schema';
import { DbCustomerRewardsToDomainMapper } from "@/core/infrastructure/mappers";
import { CustomerRewardRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/commands";

export function makeCustomerRewardRepositoryDrizzle(): CustomerRewardRepository {
  const dbCustomerRewardsToDomainMapper = new DbCustomerRewardsToDomainMapper();
  return new CustomerRewardRepositoryDrizzle({
    dbClient: db,
    customerRewardTable: customerRewards,
    customerRewardToDomainMapper: dbCustomerRewardsToDomainMapper
  })
}