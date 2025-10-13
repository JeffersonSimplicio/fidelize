import { CustomerReward } from "@/core/domain/customer-reward/customer-reward.entity";

export interface IListCustomerRewards {
  execute(): Promise<CustomerReward[]>;
}