import { Reward } from '@/core/domain/rewards/reward.entity';

export interface RewardRepository {
  create(reward: Reward): Promise<Reward>;
  getById(id: number): Promise<Reward>;
  update(reward: Reward): Promise<Reward>;
  delete(id: number): Promise<void>;
}