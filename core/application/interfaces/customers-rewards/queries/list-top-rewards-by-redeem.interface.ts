import { TopRewardDto } from '@/core/application/dtos/customer-rewards';

export interface ListTopRewardsByRedeem {
  execute(limit: number): Promise<TopRewardDto[]>;
}
