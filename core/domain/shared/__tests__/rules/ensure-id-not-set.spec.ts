import { ensureIdNotSet } from '@/core/domain/shared/rules';
import { IdAlreadyDefinedError } from '@/core/domain/shared/errors';

describe('ensureIdNotSet', () => {
  it('should not throw when id is undefined', () => {
    expect(() => ensureIdNotSet()).not.toThrow();
  });

  it('should not throw when id is explicitly undefined', () => {
    expect(() => ensureIdNotSet(undefined)).not.toThrow();
  });

  it('should throw IdAlreadyDefinedError when id is null', () => {
    expect(() => ensureIdNotSet(null as unknown as number)).toThrow(
      IdAlreadyDefinedError,
    );
  });

  it('should throw IdAlreadyDefinedError when id is 0', () => {
    expect(() => ensureIdNotSet(0)).toThrow(IdAlreadyDefinedError);
  });

  it('should throw IdAlreadyDefinedError when id is a positive number', () => {
    expect(() => ensureIdNotSet(123)).toThrow(IdAlreadyDefinedError);
  });

  it('should throw IdAlreadyDefinedError when id is a negative number', () => {
    expect(() => ensureIdNotSet(-50)).toThrow(IdAlreadyDefinedError);
  });

  it('should throw IdAlreadyDefinedError when id is NaN', () => {
    expect(() => ensureIdNotSet(NaN)).toThrow(IdAlreadyDefinedError);
  });
});
