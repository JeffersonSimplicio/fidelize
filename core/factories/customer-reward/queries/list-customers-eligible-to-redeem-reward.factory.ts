import { ListCustomersEligibleToRedeemReward } from "@/core/application/interfaces/customers-rewards";
import { ListEligibleCustomersForRewardUseCase } from "@/core/application/use-cases/customers-rewards";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { rewards } from '@/core/infrastructure/database/drizzle/schema';
import { CustomerEntityToDtoMapper, DbRewardToDomainMapper } from "@/core/infrastructure/mappers";
import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/commands";
import { makeCustomerRewardQueryRepositoryDrizzle } from "@/core/factories/infrastructure/customer-reward-query-repository-drizzle.factory";

export function makeListCustomersEligibleToRedeemReward(): ListCustomersEligibleToRedeemReward {
  const dbRewardToDomainMapper = new DbRewardToDomainMapper();
  const rewardRepo = new RewardRepositoryDrizzle({
    dbClient: db,
    rewardTable: rewards,
    rewardToDomainMapper: dbRewardToDomainMapper
  });
  const customerRewardRepo = makeCustomerRewardQueryRepositoryDrizzle();
  const mapperToDto = new CustomerEntityToDtoMapper();
  return new ListEligibleCustomersForRewardUseCase(
    rewardRepo,
    customerRewardRepo,
    mapperToDto
  );
}