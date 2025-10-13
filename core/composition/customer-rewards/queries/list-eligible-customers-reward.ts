import { ListEligibleCustomersForRewardUseCase } from "@/core/application/use-cases/customers-rewards";
import { db } from "@/core/infrastructure/database/drizzle/db";
import {
  customerRewards,
  customers,
  rewards
} from '@/core/infrastructure/database/drizzle/schema';
import { CustomerRewardRepositoryDrizzle } from "@/core/infrastructure/repositories/customer-reward.repository";
import { CustomerRepositoryDrizzle } from "@/core/infrastructure/repositories/customers.repository";
import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/rewards.repository";

const customerRepository = new CustomerRepositoryDrizzle(db, customers);
const rewardRepository = new RewardRepositoryDrizzle(db, rewards);
const customerRewardRepository = new CustomerRewardRepositoryDrizzle(db, customerRewards);

export const listEligibleCustomersForReward = new ListEligibleCustomersForRewardUseCase(
  rewardRepository,
  customerRepository,
  customerRewardRepository
);