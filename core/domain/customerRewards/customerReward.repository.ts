import { CustomerReward } from "@/core/domain/customerRewards/customerReward.entity";

export interface ICustomerRewardRepository {
  create(customerReward: CustomerReward): Promise<CustomerReward>;
  findById(id: number): Promise<CustomerReward | null>;
  findByCustomerId(id: number): Promise<CustomerReward[]>;
  findByRewardId(id: number): Promise<CustomerReward[]>;
  findAll(): Promise<CustomerReward[]>;
  delete(id: number): Promise<boolean>;
}