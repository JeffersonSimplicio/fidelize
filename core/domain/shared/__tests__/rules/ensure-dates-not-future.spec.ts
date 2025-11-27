import { ensureDatesNotInFuture } from '@/core/domain/shared/rules';
import { CreationDateInFutureError } from '@/core/domain/shared/errors';
import { LastVisitInFutureError } from '@/core/domain/customers/errors';
import { RedeemedInFutureError } from '@/core/domain/customer-rewards/errors';

describe('ensureDatesNotInFuture', () => {
  const fixedNow = new Date('2024-01-01T12:00:00.000Z');

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(fixedNow);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should not throw when no date is provided', () => {
    expect(() => ensureDatesNotInFuture({})).not.toThrow();
  });

  it('should not throw when createdAt is equal to now', () => {
    expect(() =>
      ensureDatesNotInFuture({ createdAt: new Date(fixedNow) }),
    ).not.toThrow();
  });

  it('should not throw when createdAt is in the past', () => {
    expect(() =>
      ensureDatesNotInFuture({
        createdAt: new Date('2023-12-31T10:00:00.000Z'),
      }),
    ).not.toThrow();
  });

  it('should throw CreationDateInFutureError when createdAt is in the future', () => {
    expect(() =>
      ensureDatesNotInFuture({
        createdAt: new Date('2024-01-01T13:00:00.000Z'),
      }),
    ).toThrow(CreationDateInFutureError);
  });

  it('should not throw when lastVisitAt is equal to now', () => {
    expect(() =>
      ensureDatesNotInFuture({ lastVisitAt: new Date(fixedNow) }),
    ).not.toThrow();
  });

  it('should not throw when lastVisitAt is in the past', () => {
    expect(() =>
      ensureDatesNotInFuture({
        lastVisitAt: new Date('2023-12-31T10:00:00.000Z'),
      }),
    ).not.toThrow();
  });

  it('should throw LastVisitInFutureError when lastVisitAt is in the future', () => {
    expect(() =>
      ensureDatesNotInFuture({
        lastVisitAt: new Date('2024-01-01T13:00:00.000Z'),
      }),
    ).toThrow(LastVisitInFutureError);
  });

  it('should not throw when redeemedAt is equal to now', () => {
    expect(() =>
      ensureDatesNotInFuture({ redeemedAt: new Date(fixedNow) }),
    ).not.toThrow();
  });

  it('should not throw when redeemedAt is in the past', () => {
    expect(() =>
      ensureDatesNotInFuture({
        redeemedAt: new Date('2023-12-31T10:00:00.000Z'),
      }),
    ).not.toThrow();
  });

  it('should throw RedeemedInFutureError when redeemedAt is in the future', () => {
    expect(() =>
      ensureDatesNotInFuture({
        redeemedAt: new Date('2024-01-01T13:00:00.000Z'),
      }),
    ).toThrow(RedeemedInFutureError);
  });

  it('should throw the first future date error detected (createdAt first)', () => {
    expect(() =>
      ensureDatesNotInFuture({
        createdAt: new Date('2024-01-01T13:00:00.000Z'),
        lastVisitAt: new Date('2024-01-01T13:00:00.000Z'),
        redeemedAt: new Date('2024-01-01T13:00:00.000Z'),
      }),
    ).toThrow(CreationDateInFutureError);
  });

  it('should throw LastVisitInFutureError if createdAt is valid but lastVisitAt is future', () => {
    expect(() =>
      ensureDatesNotInFuture({
        createdAt: new Date('2023-12-31T10:00:00.000Z'),
        lastVisitAt: new Date('2024-01-01T13:00:00.000Z'),
      }),
    ).toThrow(LastVisitInFutureError);
  });

  it('should throw RedeemedInFutureError if only redeemedAt is future', () => {
    expect(() =>
      ensureDatesNotInFuture({
        redeemedAt: new Date('2024-01-01T13:00:00.000Z'),
      }),
    ).toThrow(RedeemedInFutureError);
  });
});
