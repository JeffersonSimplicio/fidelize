import { Customer } from '@/core/domain/customers/customer.entity';
import {
  ensureLastVisitAfterCreation,
  ensureNonNegativePoint,
} from '@/core/domain/customers/rules';
import {
  ensureIdNotSet,
  ensureDatesNotInFuture,
} from '@/core/domain/shared/rules';

jest.mock('@/core/domain/customers/rules', () => ({
  ensureLastVisitAfterCreation: jest.fn(),
  ensureNonNegativePoint: jest.fn(),
}));
jest.mock('@/core/domain/shared/rules', () => ({
  ensureIdNotSet: jest.fn(),
  ensureDatesNotInFuture: jest.fn(),
}));

describe('Customer Entity', () => {
  describe('Success cases', () => {
    const fakeDate = new Date('2025-01-01T00:00:00Z');

    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers().setSystemTime(fakeDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should create a customer with provided values', () => {
      const customer = new Customer({
        name: 'Jefferson',
        phone: '123456789',
        points: 100,
      });

      expect(customer.name).toBe('Jefferson');
      expect(customer.phone).toBe('123456789');
      expect(customer.points).toBe(100);
      expect(customer.createdAt).toEqual(fakeDate);
      expect(customer.lastVisitAt).toEqual(fakeDate);

      expect(ensureNonNegativePoint).toHaveBeenCalledWith(100);
      expect(ensureLastVisitAfterCreation).toHaveBeenCalled();
      expect(ensureDatesNotInFuture).toHaveBeenCalled();
    });

    it('should set the customer id', () => {
      const customer = new Customer({ name: 'A', phone: '1', points: 0 });
      customer.setId(5);

      expect(customer.id).toBe(5);
      expect(ensureIdNotSet).toHaveBeenCalled();
    });

    it('should update points', () => {
      const customer = new Customer({ name: 'A', phone: '1', points: 0 });
      customer.setPoints(50);

      expect(customer.points).toBe(50);
      expect(ensureNonNegativePoint).toHaveBeenCalledWith(50);
    });

    it('should update last visit date', () => {
      const customer = new Customer({ name: 'A', phone: '1', points: 0 });
      const newDate = new Date('2025-02-01T00:00:00Z');

      customer.updateLastVisit(newDate);
      expect(customer.lastVisitAt).toEqual(newDate);
      expect(ensureLastVisitAfterCreation).toHaveBeenCalled();
      expect(ensureDatesNotInFuture).toHaveBeenCalled();
    });

    it('should add points and update visit if points increased', () => {
      const customer = new Customer({ name: 'A', phone: '1', points: 10 });
      const oldDate = customer.lastVisitAt;

      jest.advanceTimersByTime(1000);
      customer.addPointsAndUpdateVisit(20);

      expect(customer.points).toBe(20);
      expect(customer.lastVisitAt.getTime()).toBeGreaterThan(oldDate.getTime());
    });

    it('should add points but not update visit if points did not increase', () => {
      const customer = new Customer({ name: 'A', phone: '1', points: 20 });
      const oldDate = customer.lastVisitAt;

      jest.advanceTimersByTime(1000);
      customer.addPointsAndUpdateVisit(10);

      expect(customer.points).toBe(10);
      expect(customer.lastVisitAt.getTime()).toBe(oldDate.getTime());
    });

    it('should return correct persistence object', () => {
      const customer = new Customer({
        name: 'Jefferson',
        phone: '123',
        points: 5,
      });
      customer.setId(1);

      const persistence = customer.toPersistence();
      expect(persistence).toEqual({
        id: 1,
        name: 'Jefferson',
        phone: '123',
        points: 5,
        createdAt: fakeDate,
        lastVisitAt: fakeDate,
      });
    });
  });

  describe('Error cases', () => {
    const fakeDate = new Date('2025-01-01T00:00:00Z');

    beforeEach(() => {
      jest.resetAllMocks();
      jest.useFakeTimers().setSystemTime(fakeDate);

      (ensureLastVisitAfterCreation as jest.Mock).mockImplementation(() => {});
      (ensureNonNegativePoint as jest.Mock).mockImplementation(() => {});
      (ensureDatesNotInFuture as jest.Mock).mockImplementation(() => {});
      (ensureIdNotSet as jest.Mock).mockImplementation(() => {});
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should throw error if points are negative during creation', () => {
      (ensureNonNegativePoint as jest.Mock).mockImplementation(() => {
        throw new Error('Points cannot be negative');
      });

      expect(() => new Customer({ name: 'A', phone: '1', points: -5 })).toThrow(
        'Points cannot be negative',
      );
    });

    it('should throw error if points are negative when updating', () => {
      (ensureNonNegativePoint as jest.Mock)
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => {
          throw new Error('Points cannot be negative');
        });

      const customer = new Customer({ name: 'A', phone: '1', points: 0 });

      expect(() => customer.setPoints(-10)).toThrow(
        'Points cannot be negative',
      );
      expect(ensureNonNegativePoint).toHaveBeenCalledTimes(2);
    });

    it('should throw error if id is already set', () => {
      (ensureIdNotSet as jest.Mock)
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => {
          throw new Error('ID already set');
        });

      const customer = new Customer({ name: 'A', phone: '1', points: 0 });
      customer.setId(1);
      expect(() => customer.setId(5)).toThrow('ID already set');
      expect(ensureIdNotSet).toHaveBeenCalledTimes(2);
      expect(customer.id).toBe(1);
    });

    it('should throw error if last visit is before creation', () => {
      (ensureLastVisitAfterCreation as jest.Mock)
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => {
          throw new Error('Last visit cannot be before creation');
        });

      const customer = new Customer({ name: 'A', phone: '1', points: 0 });
      const invalidDate = new Date('2024-12-31T00:00:00Z');

      expect(() => customer.updateLastVisit(invalidDate)).toThrow(
        'Last visit cannot be before creation',
      );
    });

    it('should throw error if dates are in the future during creation', () => {
      (ensureDatesNotInFuture as jest.Mock).mockImplementation(() => {
        throw new Error('Dates cannot be in the future');
      });

      expect(
        () =>
          new Customer({
            name: 'A',
            phone: '1',
            points: 0,
            createdAt: new Date('2030-01-01T00:00:00Z'),
          }),
      ).toThrow('Dates cannot be in the future');
    });

    it('should throw error if dates are in the future when updating last visit', () => {
      (ensureDatesNotInFuture as jest.Mock)
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => {
          throw new Error('Dates cannot be in the future');
        });

      const customer = new Customer({ name: 'A', phone: '1', points: 0 });
      const futureDate = new Date('2030-01-01T00:00:00Z');

      expect(() => customer.updateLastVisit(futureDate)).toThrow(
        'Dates cannot be in the future',
      );
    });
  });
});
