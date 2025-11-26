import { DbRewardToDomainMapper } from '@/core/infrastructure/mappers';
import { Reward } from '@/core/domain/rewards/reward.entity';
import { RewardStatus } from '@/core/domain/rewards/reward.status';

const makeRewardSelect = (overrides?: Partial<any>) => ({
  id: 1,
  name: 'Sample Reward',
  description: 'A test reward',
  pointsRequired: 100,
  isActive: 1,
  createdAt: new Date(),
  ...overrides,
});

describe('DbRewardToDomainMapper', () => {
  let mapper: DbRewardToDomainMapper;

  beforeEach(() => {
    mapper = new DbRewardToDomainMapper();
  });

  it('should map RewardSelect to RewardEntity with active status', () => {
    const input = makeRewardSelect({ isActive: 1 });
    const rewardEntity = mapper.map(input);

    expect(rewardEntity).toBeInstanceOf(Reward);
    expect(rewardEntity.id).toBe(input.id);
    expect(rewardEntity.name).toBe(input.name);
    expect(rewardEntity.description).toBe(input.description);
    expect(rewardEntity.pointsRequired).toBe(input.pointsRequired);
    expect(rewardEntity.isActive).toBe(RewardStatus.Active);
    expect(rewardEntity.createdAt).toEqual(input.createdAt);
  });

  it('should map RewardSelect to RewardEntity with inactive status when isActive is 0', () => {
    const input = makeRewardSelect({ isActive: 0 });
    const rewardEntity = mapper.map(input);

    expect(rewardEntity.isActive).toBe(RewardStatus.Inactive);
  });

  it('should map RewardSelect to RewardEntity with inactive status when isActive is other than 1', () => {
    const input = makeRewardSelect({ isActive: 999 });
    const rewardEntity = mapper.map(input);

    expect(rewardEntity.isActive).toBe(RewardStatus.Inactive);
  });

  it('should correctly set id on the RewardEntity', () => {
    const input = makeRewardSelect({ id: 42 });
    const rewardEntity = mapper.map(input);

    expect(rewardEntity.id).toBe(42);
  });

  it('should correctly map all properties even with edge cases', () => {
    const input = makeRewardSelect({
      id: 0,
      name: '',
      description: '',
      pointsRequired: 1,
      isActive: 0,
      createdAt: new Date('2000-01-01'),
    });
    const rewardEntity = mapper.map(input);

    expect(rewardEntity.id).toBe(0);
    expect(rewardEntity.name).toBe('');
    expect(rewardEntity.description).toBe('');
    expect(rewardEntity.pointsRequired).toBe(1);
    expect(rewardEntity.isActive).toBe(RewardStatus.Inactive);
    expect(rewardEntity.createdAt).toEqual(new Date('2000-01-01'));
  });
});
