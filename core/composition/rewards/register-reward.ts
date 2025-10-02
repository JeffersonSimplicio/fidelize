import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/rewards.repository";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { rewards } from '@/core/infrastructure/database/drizzle/schema';
import { RegisterRewardUseCase } from "@/core/application/use-cases/rewards/register-reward.use-case";
import { ZodValidation } from "@/core/infrastructure/validation/zod/zod-validation";
import { registerRewardSchema } from "@/core/infrastructure/validation/zod/schemas";

const validator = new ZodValidation(registerRewardSchema);
const rewardRepository = new RewardRepositoryDrizzle(db, rewards);
export const registerReward = new RegisterRewardUseCase(
  rewardRepository,
  validator,
);