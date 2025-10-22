import { DeleteCustomerRewardDto } from "@/core/application/dtos/customer-rewards";

export interface UndoRedeemReward {
  execute(input: DeleteCustomerRewardDto): Promise<void>;
}
