import { Customer } from "@/core/domain/customers/customer.entity";

export interface IListEligibleCustomersForReward {
  execute(rewardId: number): Promise<Customer[]>;
}