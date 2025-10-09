import { db } from "@/core/infrastructure/database/drizzle/db";
import {
  customers,
  rewards,
  customerRewards
} from '@/core/infrastructure/database/drizzle/schema';
import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/rewards.repository";
import { CustomerRepositoryDrizzle } from "@/core/infrastructure/repositories/customers.repository";
import { CustomerRewardRepositoryDrizzle } from "@/core/infrastructure/repositories/customer-reward.repository";
import { ListCustomersWhoRedeemedRewardUseCase } from "@/core/application/use-cases/customer-rewards/list-customers-who-redeemed-reward.use-case";

const customerRepository = new CustomerRepositoryDrizzle(db, customers);
const rewardRepository = new RewardRepositoryDrizzle(db, rewards);
const customerRewardRepository = new CustomerRewardRepositoryDrizzle(db, customerRewards);

export const listCustomersWhoRedeemedReward = new ListCustomersWhoRedeemedRewardUseCase(
  rewardRepository,
  customerRepository,
  customerRewardRepository
);