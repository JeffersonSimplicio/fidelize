import { Reward, RewardCreateProps, RewardUpdateProps } from '@/core/domain/rewards/reward.entity';

export interface IRewardRepository {
  create(data: RewardCreateProps): Promise<Reward>;
  // findById(id: number): Promise<Reward | null>;
  // findByName(name: string): Promise<Reward | null>;
  // findAll(): Promise<Reward[]>;
  // update(id: number, data: RewardUpdateProps): Promise<Reward | null>;
  // delete(id: number): Promise<boolean>;
} 