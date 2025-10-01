import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/rewards.repository";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { rewards } from '@/core/infrastructure/database/drizzle/schema';
import { ListRewardsUseCase } from "@/core/application/use-cases/rewards/list-rewards.use-case";

const rewardRepository = new RewardRepositoryDrizzle(db, rewards);
export const listRewards = new ListRewardsUseCase(rewardRepository);