import {
  CreateCustomerRewardDto,
  CustomerRewardDto,
} from '@/core/application/dtos/customer-rewards';

export interface RedeemReward {
  execute(input: CreateCustomerRewardDto): Promise<CustomerRewardDto>;
}
