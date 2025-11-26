import { DeleteReward } from '@/core/application/interfaces/rewards';
import { DeleteRewardUseCase } from '@/core/application/use-cases/rewards';
import { makeRewardRepositoryDrizzle } from '@/core/factories/repositories';

export function makeDeleteReward(): DeleteReward {
  const rewardRepo = makeRewardRepositoryDrizzle();
  return new DeleteRewardUseCase({ rewardRepo });
}
