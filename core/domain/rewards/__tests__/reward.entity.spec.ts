import { Reward } from '@/core/domain/rewards/reward.entity';
import { RewardStatus } from '@/core/domain/rewards/reward.status';
import { ensurePointsRequiredIsValid } from '@/core/domain/rewards/rules';
import {
  ensureDatesNotInFuture,
  ensureIdNotSet,
} from '@/core/domain/shared/rules';

jest.mock('@/core/domain/rewards/rules', () => ({
  ensurePointsRequiredIsValid: jest.fn(),
}));

jest.mock('@/core/domain/shared/rules', () => ({
  ensureDatesNotInFuture: jest.fn(),
  ensureIdNotSet: jest.fn(),
}));

describe('Reward Entity', () => {
  describe('Success cases', () => {
    const fakeDate = new Date('2025-01-01T00:00:00Z');

    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers().setSystemTime(fakeDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should create a reward with provided values', () => {
      const reward = new Reward({
        name: 'Cupom 10%',
        pointsRequired: 50,
        description: 'Desconto em produtos',
      });

      expect(reward.name).toBe('Cupom 10%');
      expect(reward.pointsRequired).toBe(50);
      expect(reward.description).toBe('Desconto em produtos');
      expect(reward.isActive).toBe(RewardStatus.Active);
      expect(reward.createdAt).toEqual(fakeDate);

      expect(ensurePointsRequiredIsValid).toHaveBeenCalledWith(
        50,
        (Reward as any).MIN_POINTS_REQUIRED,
      );
      expect(ensureDatesNotInFuture).toHaveBeenCalled();
    });

    it('should create reward with inactive status', () => {
      const reward = new Reward({
        name: 'Promoção',
        pointsRequired: 10,
        description: 'Teste',
        isActive: RewardStatus.Inactive,
      });

      expect(reward.isActive).toBe(RewardStatus.Inactive);
    });

    it('should set reward id', () => {
      const reward = new Reward({
        name: 'A',
        pointsRequired: 1,
        description: 'x',
      });

      reward.setId(10);

      expect(reward.id).toBe(10);
      expect(ensureIdNotSet).toHaveBeenCalled();
    });

    it('should update pointsRequired', () => {
      const reward = new Reward({
        name: 'A',
        pointsRequired: 5,
        description: 'x',
      });

      reward.setPoints(20);

      expect(reward.pointsRequired).toBe(20);
      expect(ensurePointsRequiredIsValid).toHaveBeenCalledWith(
        20,
        (Reward as any).MIN_POINTS_REQUIRED,
      );
    });

    it('should activate and deactivate reward', () => {
      const reward = new Reward({
        name: 'Teste',
        pointsRequired: 5,
        description: 'x',
        isActive: RewardStatus.Inactive,
      });

      reward.activate();
      expect(reward.isActive).toBe(RewardStatus.Active);

      reward.deactivate();
      expect(reward.isActive).toBe(RewardStatus.Inactive);
    });

    it('should return correct persistence object', () => {
      const reward = new Reward({
        name: 'Cupom',
        pointsRequired: 10,
        description: 'desc',
      });

      reward.setId(3);

      expect(reward.toPersistence()).toEqual({
        id: 3,
        name: 'Cupom',
        pointsRequired: 10,
        description: 'desc',
        isActive: RewardStatus.Active,
        createdAt: fakeDate,
      });
    });
  });

  describe('Error cases', () => {
    const fakeDate = new Date('2025-01-01T00:00:00Z');

    beforeEach(() => {
      jest.resetAllMocks();
      jest.useFakeTimers().setSystemTime(fakeDate);

      (ensurePointsRequiredIsValid as jest.Mock).mockImplementation(() => {});
      (ensureDatesNotInFuture as jest.Mock).mockImplementation(() => {});
      (ensureIdNotSet as jest.Mock).mockImplementation(() => {});
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should throw error if pointsRequired is invalid on creation', () => {
      (ensurePointsRequiredIsValid as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid points');
      });

      expect(
        () =>
          new Reward({
            name: 'Cupom',
            pointsRequired: 0,
            description: 'desc',
          }),
      ).toThrow('Invalid points');
    });

    it('should throw error if pointsRequired is invalid on update', () => {
      (ensurePointsRequiredIsValid as jest.Mock)
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => {
          throw new Error('Invalid points');
        });

      const reward = new Reward({
        name: 'Cupom',
        pointsRequired: 10,
        description: 'desc',
      });

      expect(() => reward.setPoints(0)).toThrow('Invalid points');
      expect(ensurePointsRequiredIsValid).toHaveBeenCalledTimes(2);
    });

    it('should throw error if id is already set', () => {
      (ensureIdNotSet as jest.Mock)
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => {
          throw new Error('ID already set');
        });

      const reward = new Reward({
        name: 'Cupom',
        pointsRequired: 10,
        description: 'desc',
      });

      reward.setId(1);

      expect(() => reward.setId(5)).toThrow('ID already set');
      expect(ensureIdNotSet).toHaveBeenCalledTimes(2);
      expect(reward.id).toBe(1);
    });

    it('should throw error if createdAt is in the future', () => {
      (ensureDatesNotInFuture as jest.Mock).mockImplementation(() => {
        throw new Error('Creation date in future');
      });

      expect(
        () =>
          new Reward({
            name: 'Cupom',
            pointsRequired: 10,
            description: 'desc',
            createdAt: new Date('2030-01-01T00:00:00Z'),
          }),
      ).toThrow('Creation date in future');
    });
  });
});
