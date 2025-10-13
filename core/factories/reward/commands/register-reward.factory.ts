import { RegisterReward } from "@/core/application/interfaces";
import { RegisterRewardUseCase } from "@/core/application/use-cases";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { rewards } from '@/core/infrastructure/database/drizzle/schema';
import { DbRewardToDomainMapper, RewardEntityToDtoMapper } from "@/core/infrastructure/mappers";
import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/commands";
import { registerRewardSchema } from "@/core/infrastructure/validation/zod/schemas/rewards";
import { ZodValidation } from "@/core/infrastructure/validation/zod/zod.validation";

export function makeRegisterReward(): RegisterReward {
  const mapperToDomain = new DbRewardToDomainMapper();
  const rewardRepo = new RewardRepositoryDrizzle(db, rewards, mapperToDomain);
  const validator = new ZodValidation(registerRewardSchema);
  const mapperToDto = new RewardEntityToDtoMapper();
  return new RegisterRewardUseCase(rewardRepo, validator, mapperToDto);
}