import { DeleteRewardUseCase } from "@/core/application/use-cases/rewards";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { rewards } from '@/core/infrastructure/database/drizzle/schema';
import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/rewards.repository";

const rewardRepository = new RewardRepositoryDrizzle(db, rewards);
export const deleteReward = new DeleteRewardUseCase(rewardRepository);