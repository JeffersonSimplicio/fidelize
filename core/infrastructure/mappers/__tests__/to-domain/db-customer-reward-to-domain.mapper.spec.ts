import { DbCustomerRewardsToDomainMapper } from '@/core/infrastructure/mappers';
import { CustomerReward } from '@/core/domain/customer-rewards/customer-reward.entity';

type FakeCustomerRewardSelect = {
  id: number;
  customerId: number;
  rewardId: number;
  redeemedAt: Date;
};

describe('DbCustomerRewardsToDomainMapper', () => {
  let mapper: DbCustomerRewardsToDomainMapper;

  beforeEach(() => {
    mapper = new DbCustomerRewardsToDomainMapper();
  });

  it('should map database row to domain CustomerReward and set the id', () => {
    const now = new Date();
    const dbRow: FakeCustomerRewardSelect = {
      id: 123,
      customerId: 10,
      rewardId: 20,
      redeemedAt: now,
    };

    const domain = mapper.map(dbRow);

    expect(domain).toBeInstanceOf(CustomerReward);
    expect(domain.customerId).toBe(dbRow.customerId);
    expect(domain.rewardId).toBe(dbRow.rewardId);

    expect(domain.redeemedAt.toISOString()).toBe(
      dbRow.redeemedAt.toISOString(),
    );

    expect(domain.id).toBe(dbRow.id);
  });

  it('should allow mapping when redeemedAt equals now (not in the future)', () => {
    const now = new Date();
    const dbRow: FakeCustomerRewardSelect = {
      id: 1,
      customerId: 2,
      rewardId: 3,
      redeemedAt: new Date(now.getTime()),
    };

    const domain = mapper.map(dbRow);

    expect(domain.redeemedAt.getTime()).toBe(dbRow.redeemedAt.getTime());
    expect(domain.id).toBe(1);
  });

  it('should throw when redeemedAt is in the future', () => {
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const dbRow: FakeCustomerRewardSelect = {
      id: 9,
      customerId: 7,
      rewardId: 8,
      redeemedAt: future,
    };

    expect(() => mapper.map(dbRow)).toThrow();
  });
});
