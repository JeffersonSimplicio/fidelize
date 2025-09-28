import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/rewards.repository";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { rewards } from '@/core/infrastructure/database/drizzle/schema';
import { DeleteRewardUseCase } from "@/core/application/use-cases/rewards/delete-reward.use-case";

const rewardRepository = new RewardRepositoryDrizzle(db, rewards);
export const deleteReward = new DeleteRewardUseCase(rewardRepository);