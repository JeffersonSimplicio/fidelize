import { CustomerRewardRedemptionDto } from '@/core/application/dtos/customer-rewards';

export interface ListCustomersWhoRedeemedReward {
  execute(rewardId: number): Promise<CustomerRewardRedemptionDto[]>;
}
