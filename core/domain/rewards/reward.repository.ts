import { Reward } from '@/core/domain/rewards/reward.entity';

export interface IRewardRepository {
  create(reward: Reward): Promise<Reward>;
  findById(id: number): Promise<Reward | null>;
  findByName(name: string): Promise<Reward[]>;
  findAll(): Promise<Reward[]>;
  update(reward: Reward): Promise<Reward | null>;
  delete(id: number): Promise<boolean>;
} 