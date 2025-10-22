import { CustomerRewardQueryRepository } from "@/core/domain/customer-rewards/customer-reward.query.repository.interface";
import { db } from "@/core/infrastructure/database/drizzle/db";
import {
  rewards,
  customers,
  customerRewards
} from '@/core/infrastructure/database/drizzle/schema';
import {
  DbRewardToDomainMapper,
  DbCustomerRewardsToDomainMapper,
  DbCustomerToDomainMapper,
} from "@/core/infrastructure/mappers";
import { CustomerRewardQueryRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle";


export function makeCustomerRewardQueryRepositoryDrizzle(): CustomerRewardQueryRepository {
  const dbRewardToDomainMapper = new DbRewardToDomainMapper();
  const dbCustomerToDomainMapper = new DbCustomerToDomainMapper();
  const dbCustomerRewardsToDomainMapper = new DbCustomerRewardsToDomainMapper();

  return new CustomerRewardQueryRepositoryDrizzle({
    dbClient: db,
    rewardTable: rewards,
    rewardToDomainMapper: dbRewardToDomainMapper,
    customerTable: customers,
    customerToDomainMapper: dbCustomerToDomainMapper,
    customerRewardTable: customerRewards,
    customerRewardToDomainMapper: dbCustomerRewardsToDomainMapper,
  });
}