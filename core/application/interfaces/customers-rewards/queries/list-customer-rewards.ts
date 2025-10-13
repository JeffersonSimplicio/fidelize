import { CustomerReward } from "@/core/domain/customer-rewards/customer-reward.entity";

export interface IListCustomerRewards {
  execute(): Promise<CustomerReward[]>;
}