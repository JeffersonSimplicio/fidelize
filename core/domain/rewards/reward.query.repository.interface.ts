import { Reward } from '@/core/domain/rewards/reward.entity';

export interface RewardQueryRepository {
  findByName(name: string): Promise<Reward[]>;
  findAll(): Promise<Reward[]>;
  findAllActive(): Promise<Reward[]>;
  findAllInactive(): Promise<Reward[]>;
}