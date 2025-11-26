import { RewardEntityToDtoMapper } from '@/core/infrastructure/mappers';
import { Reward } from '@/core/domain/rewards/reward.entity';
import { RewardStatus } from '@/core/domain/rewards/reward.status';

describe('RewardEntityToDtoMapper', () => {
  let mapper: RewardEntityToDtoMapper;

  beforeEach(() => {
    mapper = new RewardEntityToDtoMapper();
  });

  it('should map a Reward entity to RewardDto', () => {
    const createdAt = new Date('2024-03-01T12:00:00.000Z');
    const reward = new Reward({
      name: 'Test Reward',
      description: 'A great prize',
      pointsRequired: 42,
      isActive: RewardStatus.Active,
      createdAt,
    });
    reward.setId(123);

    const dto = mapper.map(reward);

    expect(dto.id).toBe(123);
    expect(dto.name).toBe('Test Reward');
    expect(dto.description).toBe('A great prize');
    expect(dto.pointsRequired).toBe(42);
    expect(dto.isActive).toBe(true);
    expect(dto.createdAt).toBe(createdAt.toISOString());
  });

  it('should map isActive = false when Reward entity is Inactive', () => {
    const reward = new Reward({
      name: 'Inactive Reward',
      description: 'Not available',
      pointsRequired: 5,
      isActive: RewardStatus.Inactive,
    });
    reward.setId(7);

    const dto = mapper.map(reward);

    expect(dto.isActive).toBe(false);
    expect(dto.id).toBe(7);
    expect(dto.name).toBe('Inactive Reward');
  });

  it('should not mutate the original Reward entity when mapping', () => {
    const createdAt = new Date();
    const reward = new Reward({
      name: 'Immutable',
      description: 'Should not mutate',
      pointsRequired: 1,
      isActive: RewardStatus.Active,
      createdAt,
    });
    reward.setId(55);

    const before = {
      id: reward.id,
      name: reward.name,
      description: reward.description,
      pointsRequired: reward.pointsRequired,
      isActive: reward.isActive,
      createdAt: reward.createdAt,
    };

    const dto = mapper.map(reward);

    expect(dto.id).toBe(55);

    expect(reward.id).toBe(before.id);
    expect(reward.name).toBe(before.name);
    expect(reward.description).toBe(before.description);
    expect(reward.pointsRequired).toBe(before.pointsRequired);
    expect(reward.isActive).toBe(before.isActive);
    expect(reward.createdAt.getTime()).toBe(before.createdAt.getTime());
  });

  it('should map even if the entity id is not set (returns undefined id)', () => {
    const reward = new Reward({
      name: 'NoId',
      description: 'No id set',
      pointsRequired: 3,
      isActive: RewardStatus.Active,
    });

    const dto = mapper.map(reward as Reward);

    expect(dto.name).toBe('NoId');
    expect(dto.pointsRequired).toBe(3);
    expect(dto.isActive).toBe(true);
    expect(dto.createdAt).toBe(reward.createdAt.toISOString());
    expect(dto.id).toBeUndefined();
  });
});
