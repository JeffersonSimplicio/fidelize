import { registerRewardSchema } from "@/core/infrastructure/validation/zod/schemas";
import { ZodValidation } from "@/core/infrastructure/validation/zod/zod.validation";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { rewards } from '@/core/infrastructure/database/drizzle/schema';
import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/write/reward.repository";
import { DbRewardToDomainMapper, RewardEntityToDtoMapper } from "@/core/infrastructure/mappers";
import { RegisterRewardUseCase } from "@/core/application/use-cases";
import { RegisterReward } from "@/core/application/interfaces";

export function makeRegisterReward(): RegisterReward {
  const mapperToDomain = new DbRewardToDomainMapper();
  const rewardRepo = new RewardRepositoryDrizzle(db, rewards, mapperToDomain);
  const validator = new ZodValidation(registerRewardSchema);
  const mapperToDto = new RewardEntityToDtoMapper();
  return new RegisterRewardUseCase(rewardRepo, validator, mapperToDto);
}