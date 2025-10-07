export interface IUndoRedeemReward {
  execute(customerId: number, rewardId: number): Promise<boolean>;
}
