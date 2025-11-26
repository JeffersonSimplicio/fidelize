import { Reward } from '@/core/domain/rewards/reward.entity';

export class CustomerRedeemedReward {
  constructor(
    public readonly reward: Reward,
    public readonly redeemedAt: Date,
  ) {}
}
