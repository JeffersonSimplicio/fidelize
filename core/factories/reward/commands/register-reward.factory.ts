import { RegisterReward } from "@/core/application/interfaces";
import { RegisterRewardUseCase } from "@/core/application/use-cases";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { rewards } from '@/core/infrastructure/database/drizzle/schema';
import { DbRewardToDomainMapper, RewardEntityToDtoMapper } from "@/core/infrastructure/mappers";
import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/commands";
import { registerRewardSchema } from "@/core/infrastructure/validation/zod/schemas/rewards";
import { ZodValidation } from "@/core/infrastructure/validation/zod/zod.validation";

export function makeRegisterReward(): RegisterReward {
  const dbRewardToDomainMapper = new DbRewardToDomainMapper();
  const rewardRepo = new RewardRepositoryDrizzle({
    dbClient: db,
    rewardTable: rewards,
    rewardToDomainMapper: dbRewardToDomainMapper
  });
  const validator = new ZodValidation(registerRewardSchema);
  const rewardMapToDto = new RewardEntityToDtoMapper();
  return new RegisterRewardUseCase(rewardRepo, validator, rewardMapToDto);
}