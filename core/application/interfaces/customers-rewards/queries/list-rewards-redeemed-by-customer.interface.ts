import { CustomerRedeemedRewardDto } from '@/core/application/dtos/customer-rewards';

export interface ListRewardsRedeemedByCustomer {
  execute(customerId: number): Promise<CustomerRedeemedRewardDto[]>;
}
