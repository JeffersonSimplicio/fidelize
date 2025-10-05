import { CustomerReward } from "@/core/domain/customerRewards/customerReward.entity";

export interface ICustomerRewardRepository {
  create(customer: CustomerReward): Promise<CustomerReward>;
  findById(id: number): Promise<CustomerReward | null>;
  findByCustomerId(id: number): Promise<CustomerReward[] | null>;
  findByRewardId(id: number): Promise<CustomerReward[] | null>;
  delete(id: number): Promise<boolean>;
}