import { Customer } from "@/core/domain/customers/customer.entity";

export interface IListCustomersWhoRedeemedReward {
  execute(rewardId: number): Promise<Customer[]>;
}