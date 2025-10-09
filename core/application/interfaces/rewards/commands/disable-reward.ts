export interface IDisableReward {
  execute(id: number): Promise<boolean>;
}