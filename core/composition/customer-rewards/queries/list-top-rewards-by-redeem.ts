import { ListTopRewardsByRedeemUseCase } from "@/core/application/use-cases/customers-rewards";
import { db } from "@/core/infrastructure/database/drizzle/db";
import {
  customerRewards,
  rewards
} from '@/core/infrastructure/database/drizzle/schema';
import { CustomerRewardRepositoryDrizzle } from "@/core/infrastructure/repositories/customer-reward.repository";
import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/rewards.repository";

const rewardRepository = new RewardRepositoryDrizzle(db, rewards);
const customerRewardRepository = new CustomerRewardRepositoryDrizzle(db, customerRewards);

export const listTopRewardsByRedeem = new ListTopRewardsByRedeemUseCase(
  rewardRepository,
  customerRewardRepository
);