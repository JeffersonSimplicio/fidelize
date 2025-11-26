import { Reward } from '@/core/domain/rewards/reward.entity';

export class TopReward {
  constructor(
    public readonly reward: Reward,
    public readonly redeemedCount: number,
  ) {}
}
