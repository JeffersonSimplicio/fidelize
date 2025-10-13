export interface UndoRedeemReward {
  execute(customerId: number, rewardId: number): Promise<void>;
}
