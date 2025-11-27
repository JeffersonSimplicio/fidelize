import { RewardDto } from '@/core/application/dtos';

export interface ListAvailableRewardsForCustomer {
  execute(customerId: number): Promise<RewardDto[]>;
}
