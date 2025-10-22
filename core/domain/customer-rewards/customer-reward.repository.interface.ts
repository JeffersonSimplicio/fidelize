import { CustomerReward } from "@/core/domain/customer-rewards/customer-reward.entity";

export interface CustomerRewardRepository {
  create(customerReward: CustomerReward): Promise<CustomerReward>;
  getById(id: number): Promise<CustomerReward>;
  // findByCustomerId(id: number): Promise<CustomerReward[]>;
  // findByRewardId(id: number): Promise<CustomerReward[]>;
  // findAll(): Promise<CustomerReward[]>;
  alreadyRedeemed(customerId: number, rewardId: number): Promise<CustomerReward | null>;
  delete(id: number): Promise<void>;
}