import { CustomerDto } from "@/core/application/dtos/customers";

export interface ListCustomersEligibleToRedeemReward {
  execute(rewardId: number): Promise<CustomerDto[]>;
}