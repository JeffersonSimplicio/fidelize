import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/rewards.repository";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { rewards } from '@/core/infrastructure/database/drizzle/schema';
import { ListRewardsActiveUseCase } from "@/core/application/use-cases/rewards/list-rewards-active.use-case";

const rewardRepository = new RewardRepositoryDrizzle(db, rewards);
export const listRewardsActive = new ListRewardsActiveUseCase(rewardRepository);