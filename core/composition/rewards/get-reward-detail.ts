import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/rewards.repository";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { rewards } from '@/core/infrastructure/database/drizzle/schema';
import { GetRewardDetailUseCase } from "@/core/application/use-cases/rewards/get-reward-detail.use-case";

const rewardRepository = new RewardRepositoryDrizzle(db, rewards);
export const rewardDetail = new GetRewardDetailUseCase(rewardRepository);