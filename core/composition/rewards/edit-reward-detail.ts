import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/rewards.repository";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { rewards } from '@/core/infrastructure/database/drizzle/schema';
import { EditRewardDetailUseCase } from "@/core/application/use-cases/rewards/edit-reward-detail.use-case";
import { ZodValidation } from "@/core/infrastructure/validation/zod/zod-validation";
import { editRewardSchema } from "@/core/infrastructure/validation/zod/schemas";

const validator = new ZodValidation(editRewardSchema);
const rewardRepository = new RewardRepositoryDrizzle(db, rewards);
export const editRewardDetail = new EditRewardDetailUseCase(
  rewardRepository,
  validator
);