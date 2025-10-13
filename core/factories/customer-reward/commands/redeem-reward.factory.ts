import { RedeemReward } from "@/core/application/interfaces/customers-rewards";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { rewards, customers, customerRewards } from '@/core/infrastructure/database/drizzle/schema';
import {
  DbCustomerToDomainMapper,
  DbRewardToDomainMapper,
  DbCustomerRewardsToDomainMapper,
  CustomerRewardEntityToDtoMapper,
} from "@/core/infrastructure/mappers";
import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/write/reward.repository";
import { CustomerRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/write/customer.repository";
import { CustomerRewardRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/write/customer-reward.repository";
import { RedeemRewardUseCase } from "@/core/application/use-cases";

export function makeRedeemReward(): RedeemReward {
  const mapperRewardToDomain = new DbRewardToDomainMapper();
  const rewardRepo = new RewardRepositoryDrizzle(
    db,
    rewards,
    mapperRewardToDomain,
  );

  const mapperCustomerToDomain = new DbCustomerToDomainMapper();
  const customerRepo = new CustomerRepositoryDrizzle(
    db,
    customers,
    mapperCustomerToDomain
  );

  const mapperCustomerRewardToDomain = new DbCustomerRewardsToDomainMapper();
  const customerRewardRepo = new CustomerRewardRepositoryDrizzle(
    db,
    customerRewards,
    mapperCustomerRewardToDomain
  )

  const mapperCustomerRewardEntityToDto = new CustomerRewardEntityToDtoMapper();
  return new RedeemRewardUseCase(
    rewardRepo,
    customerRepo,
    customerRewardRepo,
    mapperCustomerRewardEntityToDto
  );
}