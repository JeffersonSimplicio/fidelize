export interface DeleteReward {
  execute(id: number): Promise<void>;
}