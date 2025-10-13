import { RedeemReward } from "@/core/application/interfaces/customers-rewards";
import { RedeemRewardUseCase } from "@/core/application/use-cases";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { customerRewards, customers, rewards } from '@/core/infrastructure/database/drizzle/schema';
import {
  CustomerRewardEntityToDtoMapper,
  DbCustomerRewardsToDomainMapper,
  DbCustomerToDomainMapper,
  DbRewardToDomainMapper,
} from "@/core/infrastructure/mappers";
import {
  CustomerRewardRepositoryDrizzle,
  CustomerRepositoryDrizzle,
  RewardRepositoryDrizzle
} from "@/core/infrastructure/repositories/drizzle/commands";

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