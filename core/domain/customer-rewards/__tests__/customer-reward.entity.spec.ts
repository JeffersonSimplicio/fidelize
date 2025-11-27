import { CustomerReward } from '@/core/domain/customer-rewards/customer-reward.entity';
import {
  ensureIdNotSet,
  ensureDatesNotInFuture,
} from '@/core/domain/shared/rules';

jest.mock('@/core/domain/shared/rules', () => ({
  ensureIdNotSet: jest.fn(),
  ensureDatesNotInFuture: jest.fn(),
}));

describe('CustomerReward Entity', () => {
  describe('Success cases', () => {
    const fakeDate = new Date('2025-01-01T00:00:00Z');

    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers().setSystemTime(fakeDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should create a customerReward with default redeemedAt', () => {
      const cr = new CustomerReward({
        customerId: 1,
        rewardId: 2,
      });

      expect(cr.customerId).toBe(1);
      expect(cr.rewardId).toBe(2);
      expect(cr.redeemedAt).toEqual(fakeDate);

      expect(ensureDatesNotInFuture).toHaveBeenCalledWith({
        redeemedAt: fakeDate,
      });
    });

    it('should create a customerReward with provided redeemedAt', () => {
      const date = new Date('2024-12-10T00:00:00Z');

      const cr = new CustomerReward({
        customerId: 7,
        rewardId: 10,
        redeemedAt: date,
      });

      expect(cr.redeemedAt).toEqual(date);
      expect(ensureDatesNotInFuture).toHaveBeenCalledWith({
        redeemedAt: date,
      });
    });

    it('should set id when not previously set', () => {
      const cr = new CustomerReward({
        customerId: 1,
        rewardId: 1,
      });

      cr.setId(99);

      expect(cr.id).toBe(99);
      expect(ensureIdNotSet).toHaveBeenCalled();
    });

    it('should return correct persistence object', () => {
      const cr = new CustomerReward({
        customerId: 5,
        rewardId: 9,
      });

      cr.setId(3);

      expect(cr.toPersistence()).toEqual({
        id: 3,
        customerId: 5,
        rewardId: 9,
        redeemedAt: fakeDate,
      });
    });
  });

  describe('Error cases', () => {
    const fakeDate = new Date('2025-01-01T00:00:00Z');

    beforeEach(() => {
      jest.resetAllMocks();
      jest.useFakeTimers().setSystemTime(fakeDate);

      (ensureIdNotSet as jest.Mock).mockImplementation(() => {});
      (ensureDatesNotInFuture as jest.Mock).mockImplementation(() => {});
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should throw if redeemedAt is in the future', () => {
      (ensureDatesNotInFuture as jest.Mock).mockImplementation(() => {
        throw new Error('redeemedAt in future');
      });

      expect(
        () =>
          new CustomerReward({
            customerId: 1,
            rewardId: 2,
            redeemedAt: new Date('2030-01-01T00:00:00Z'),
          }),
      ).toThrow('redeemedAt in future');
    });

    it('should throw error if id already set', () => {
      (ensureIdNotSet as jest.Mock)
        .mockImplementationOnce(() => {}) // first set ok
        .mockImplementationOnce(() => {
          throw new Error('ID already set');
        });

      const cr = new CustomerReward({
        customerId: 1,
        rewardId: 2,
      });

      cr.setId(10);

      expect(() => cr.setId(50)).toThrow('ID already set');
      expect(ensureIdNotSet).toHaveBeenCalledTimes(2);
      expect(cr.id).toBe(10);
    });
  });
});
