export type Reward = {
  id: number;
  name: string;
  pointsRequired: number;
  description: string;
  createdAt: Date;
}

export type RewardCreateProps = Omit<Reward, 'id'>;

export type RewardUpdateProps = Partial<Omit<Reward, 'id' | 'createdAt'>>;