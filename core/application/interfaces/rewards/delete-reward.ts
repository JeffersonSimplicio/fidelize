export interface IDeleteReward {
  execute(id: number): Promise<boolean>;
}