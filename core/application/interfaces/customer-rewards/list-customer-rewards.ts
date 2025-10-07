import { CustomerReward } from "@/core/domain/customerRewards/customerReward.entity";

export interface IListCustomerRewards {
  execute(): Promise<CustomerReward[]>;
}