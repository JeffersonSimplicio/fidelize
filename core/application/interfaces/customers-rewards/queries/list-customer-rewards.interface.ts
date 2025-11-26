import { CustomerRewardDto } from '@/core/application/dtos/customer-rewards';

export interface ListCustomerRewards {
  execute(): Promise<CustomerRewardDto[]>;
}
