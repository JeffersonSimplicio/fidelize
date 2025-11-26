import { ensureNonNegativePoint } from '@/core/domain/customers/rules';
import { NegativePointsError } from '@/core/domain/customers/errors';

describe('ensureNonNegativePoint', () => {
  it('should not throw when value is equal to minimum', () => {
    expect(() => ensureNonNegativePoint(0)).not.toThrow();
  });

  it('should not throw when value is greater than minimum', () => {
    expect(() => ensureNonNegativePoint(10)).not.toThrow();
  });

  it('should throw NegativePointsError when value is less than minimum', () => {
    expect(() => ensureNonNegativePoint(-1)).toThrow(NegativePointsError);
  });
});
