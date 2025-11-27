import { ensureLastVisitAfterCreation } from '@/core/domain/customers/rules';
import { LastVisitBeforeCreationError } from '@/core/domain/customers/errors';

describe('ensureLastVisitAfterCreation', () => {
  it('should not throw when lastVisitAt is equal to createdAt', () => {
    const date = new Date('2025-11-21T10:00:00Z');
    expect(() => ensureLastVisitAfterCreation(date, date)).not.toThrow();
  });

  it('should not throw when lastVisitAt is after createdAt', () => {
    const createdAt = new Date('2025-11-21T09:00:00Z');
    const lastVisitAt = new Date('2025-11-21T10:00:00Z');
    expect(() =>
      ensureLastVisitAfterCreation(lastVisitAt, createdAt),
    ).not.toThrow();
  });

  it('should throw LastVisitBeforeCreationError when lastVisitAt is before createdAt', () => {
    const createdAt = new Date('2025-11-21T10:00:00Z');
    const lastVisitAt = new Date('2025-11-21T09:00:00Z');
    expect(() => ensureLastVisitAfterCreation(lastVisitAt, createdAt)).toThrow(
      LastVisitBeforeCreationError,
    );
  });
});
