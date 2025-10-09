import { RegisterRewardUseCase } from "@/core/application/use-cases/rewards";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { rewards } from '@/core/infrastructure/database/drizzle/schema';
import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/rewards.repository";
import { registerRewardSchema } from "@/core/infrastructure/validation/zod/schemas";
import { ZodValidation } from "@/core/infrastructure/validation/zod/zod-validation";

const validator = new ZodValidation(registerRewardSchema);
const rewardRepository = new RewardRepositoryDrizzle(db, rewards);
export const registerReward = new RegisterRewardUseCase(
  rewardRepository,
  validator,
);