import { RegisterReward } from '@/core/application/interfaces';
import { RegisterRewardUseCase } from '@/core/application/use-cases';
import { makeRewardRepositoryDrizzle } from '@/core/factories/repositories';
import { RewardEntityToDtoMapper } from '@/core/infrastructure/mappers';
import { registerRewardSchema } from '@/core/infrastructure/validation/zod/schemas/rewards';
import { ZodValidation } from '@/core/infrastructure/validation/zod/zod.validation';

export function makeRegisterReward(): RegisterReward {
  const rewardRepo = makeRewardRepositoryDrizzle();
  const zodValidation = new ZodValidation(registerRewardSchema);
  const rewardEntityToDtoMapper = new RewardEntityToDtoMapper();
  return new RegisterRewardUseCase({
    rewardRepo: rewardRepo,
    createRewardValidator: zodValidation,
    rewardToDtoMapper: rewardEntityToDtoMapper,
  });
}
