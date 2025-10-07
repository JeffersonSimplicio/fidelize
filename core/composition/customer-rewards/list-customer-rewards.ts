import { db } from "@/core/infrastructure/database/drizzle/db";
import { customerRewards } from '@/core/infrastructure/database/drizzle/schema';
import { CustomerRewardRepositoryDrizzle } from "@/core/infrastructure/repositories/customer-reward.repository";
import { ListCustomerRewardsUseCase } from "@/core/application/use-cases/customer-rewards/list-customer-rewards.use-case";

const customerRewardRepository = new CustomerRewardRepositoryDrizzle(db, customerRewards);

export const listCustomerRewards = new ListCustomerRewardsUseCase(
  customerRewardRepository
);