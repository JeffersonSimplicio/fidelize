import { resolveLastVisit } from '@/core/domain/customers/rules';

describe('resolveLastVisit', () => {
  it('should return newLastVisit when it is provided', () => {
    const current = new Date('2025-01-01T10:00:00Z');
    const provided = new Date('2025-02-01T10:00:00Z');

    const result = resolveLastVisit(10, 20, current, provided);

    expect(result).toBe(provided);
  });

  it('should return a new Date when newPoints is greater than currentPoints and no newLastVisit is provided', () => {
    const current = new Date('2025-01-01T10:00:00Z');

    const beforeCall = Date.now();
    const result = resolveLastVisit(10, 11, current);
    const afterCall = Date.now();

    expect(result.getTime()).toBeGreaterThanOrEqual(beforeCall);
    expect(result.getTime()).toBeLessThanOrEqual(afterCall);
  });

  it('should return currentLastVisit when newPoints is equal to currentPoints', () => {
    const current = new Date('2025-01-01T10:00:00Z');

    const result = resolveLastVisit(10, 10, current);

    expect(result).toBe(current);
  });

  it('should return currentLastVisit when newPoints is less than currentPoints', () => {
    const current = new Date('2025-01-01T10:00:00Z');

    const result = resolveLastVisit(10, 5, current);

    expect(result).toBe(current);
  });

  it('should return currentLastVisit when newPoints is undefined', () => {
    const current = new Date('2025-01-01T10:00:00Z');

    const result = resolveLastVisit(10, undefined, current);

    expect(result).toBe(current);
  });

  it('should prioritize newLastVisit even if newPoints is greater than currentPoints', () => {
    const current = new Date('2025-01-01T10:00:00Z');
    const provided = new Date('2025-02-01T10:00:00Z');

    const result = resolveLastVisit(10, 20, current, provided);

    expect(result).toBe(provided);
  });

  it('should return currentLastVisit when all optional parameters are missing except currentLastVisit', () => {
    const current = new Date('2025-01-01T10:00:00Z');

    const result = resolveLastVisit(0, undefined, current, undefined);

    expect(result).toBe(current);
  });

  it('should not mutate the original currentLastVisit date object', () => {
    const current = new Date('2025-01-01T10:00:00Z');

    const result = resolveLastVisit(10, 5, current);

    expect(result).toBe(current);
    expect(result.getTime()).toBe(current.getTime());
  });
});
