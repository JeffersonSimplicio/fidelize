import { CustomerRewardEntityToDtoMapper } from '@/core/infrastructure/mappers';
import { CustomerReward } from '@/core/domain/customer-rewards/customer-reward.entity';

describe('CustomerRewardEntityToDtoMapper', () => {
  let mapper: CustomerRewardEntityToDtoMapper;

  beforeEach(() => {
    mapper = new CustomerRewardEntityToDtoMapper();
  });

  it('should map a CustomerReward entity to CustomerRewardDto', () => {
    const redeemedAt = new Date('2024-04-01T10:00:00.000Z');
    const entity = new CustomerReward({
      customerId: 11,
      rewardId: 22,
      redeemedAt,
    });
    entity.setId(123);

    const dto = mapper.map(entity);

    expect(dto.id).toBe(123);
    expect(dto.customerId).toBe(11);
    expect(dto.rewardId).toBe(22);
    expect(dto.redeemedAt).toBe(redeemedAt.toISOString());
  });

  it('should map when id is not set (runtime undefined id)', () => {
    const now = new Date();
    const entity = new CustomerReward({
      customerId: 7,
      rewardId: 8,
      redeemedAt: now,
    });

    const dto = mapper.map(entity as CustomerReward);

    expect(dto.id).toBeUndefined();
    expect(dto.customerId).toBe(7);
    expect(dto.rewardId).toBe(8);
    expect(dto.redeemedAt).toBe(now.toISOString());
  });

  it('should not mutate the original entity when mapping', () => {
    const redeemedAt = new Date();
    const entity = new CustomerReward({
      customerId: 3,
      rewardId: 4,
      redeemedAt,
    });
    entity.setId(555);

    const before = {
      id: entity.id,
      customerId: entity.customerId,
      rewardId: entity.rewardId,
      redeemedAt: entity.redeemedAt.getTime(),
    };

    const dto = mapper.map(entity);

    expect(dto.id).toBe(555);
    expect(dto.customerId).toBe(3);
    expect(dto.rewardId).toBe(4);
    expect(dto.redeemedAt).toBe(redeemedAt.toISOString());

    expect(entity.id).toBe(before.id);
    expect(entity.customerId).toBe(before.customerId);
    expect(entity.rewardId).toBe(before.rewardId);
    expect(entity.redeemedAt.getTime()).toBe(before.redeemedAt);
  });

  it('should map correctly when redeemedAt equals now (edge equality)', () => {
    const now = new Date();
    const entity = new CustomerReward({
      customerId: 99,
      rewardId: 100,
      redeemedAt: new Date(now.getTime()),
    });
    entity.setId(1);

    const dto = mapper.map(entity);

    expect(dto.redeemedAt).toBe(now.toISOString());
    expect(dto.customerId).toBe(99);
    expect(dto.rewardId).toBe(100);
  });
});
