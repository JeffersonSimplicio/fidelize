import { Reward } from "../interfaces/reward";

// Mock inicial
let rewards: Reward[] = [
  { id: 1, name: "Café Grátis", pointsRequired: 5, description: "Ganhe um café gratuito em sua próxima visita." },
  { id: 2, name: "Desconto 10%", pointsRequired: 10, description: "10% de desconto na sua próxima compra." },
  { id: 3, name: "Brinde Especial", pointsRequired: 15, description: "Receba um brinde exclusivo." },
];

// Simula atraso do banco (200ms)
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

export const rewardsDb = {
  async getAll(): Promise<Reward[]> {
    await delay();
    return [...rewards]; // retorna cópia
  },

  async getById(id: number): Promise<Reward | undefined> {
    await delay();
    return rewards.find(r => r.id === id);
  },

  async add(reward: Omit<Reward, "id">): Promise<Reward> {
    await delay();
    const newReward: Reward = { ...reward, id: Date.now() }; // id fake
    rewards.push(newReward);
    return newReward;
  },

  async update(id: number, data: Partial<Reward>): Promise<Reward | undefined> {
    await delay();
    const index = rewards.findIndex(r => r.id === id);
    if (index === -1) return undefined;

    rewards[index] = { ...rewards[index], ...data };
    return rewards[index];
  },

  async remove(id: number): Promise<boolean> {
    await delay();
    const prevLength = rewards.length;
    rewards = rewards.filter(r => r.id !== id);
    return rewards.length < prevLength;
  }
};
