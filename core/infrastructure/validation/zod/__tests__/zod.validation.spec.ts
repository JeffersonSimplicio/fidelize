import { ZodValidation } from '@/core/infrastructure/validation/zod/zod.validation';
import { validationFieldLabels } from '@/core/domain/validation/validation-field-labels';
import { ValidationError } from '@/core/domain/validation/validation.interface';

type FakeZodSchema<T> = {
  safeParse(input: T):
    | { success: true; data?: any }
    | {
        success: false;
        error: { errors: { path: (string | number)[]; message: string }[] };
      };
};

describe('ZodValidation', () => {
  it('returns empty array when schema.safeParse reports success', () => {
    const fakeSchema: FakeZodSchema<any> = {
      safeParse: jest.fn().mockReturnValue({ success: true }),
    };

    const validator = new ZodValidation(fakeSchema as any);

    const result = validator.validate({ some: 'input' });

    expect(result).toEqual([]);
    expect((fakeSchema.safeParse as jest.Mock).mock.calls.length).toBe(1);
  });

  it('maps a single zod error to ValidationError using field label when available', () => {
    const fakeSchema: FakeZodSchema<any> = {
      safeParse: jest.fn().mockReturnValue({
        success: false,
        error: {
          errors: [{ path: ['name'], message: 'Name is required' }],
        },
      }),
    };

    const validator = new ZodValidation(fakeSchema as any);

    const result = validator.validate({});

    const expected: ValidationError[] = [
      {
        field: validationFieldLabels['name'],
        message: 'Name is required',
      },
    ];
    expect(result).toEqual(expected);
  });

  it('maps nested/path errors joining path with dots and uses label fallback when missing', () => {
    const fakeSchema: FakeZodSchema<any> = {
      safeParse: jest.fn().mockReturnValue({
        success: false,
        error: {
          errors: [
            { path: ['address', 'street'], message: 'Street is required' },
            { path: ['unknownField'], message: 'Unknown is wrong' },
            { path: [], message: 'Root level error' },
          ],
        },
      }),
    };

    const validator = new ZodValidation(fakeSchema as any);

    const result = validator.validate({});

    expect(result).toEqual([
      { field: 'address.street', message: 'Street is required' },
      { field: 'unknownField', message: 'Unknown is wrong' },
      { field: '', message: 'Root level error' },
    ]);
  });

  it('maps multiple errors and mixes label-mapped and raw-field names', () => {
    const fakeSchema: FakeZodSchema<any> = {
      safeParse: jest.fn().mockReturnValue({
        success: false,
        error: {
          errors: [
            { path: ['points'], message: 'Must be non-negative' },
            { path: ['description'], message: 'Too short' },
            { path: ['nested', 'pointsRequired'], message: 'Invalid' },
          ],
        },
      }),
    };

    const validator = new ZodValidation(fakeSchema as any);

    const result = validator.validate({});

    expect(result).toEqual([
      {
        field: validationFieldLabels['points'],
        message: 'Must be non-negative',
      },
      { field: validationFieldLabels['description'], message: 'Too short' },
      { field: 'nested.pointsRequired', message: 'Invalid' },
    ]);
  });

  it('preserves the order of errors returned from zod', () => {
    const fakeSchema: FakeZodSchema<any> = {
      safeParse: jest.fn().mockReturnValue({
        success: false,
        error: {
          errors: [
            { path: ['first'], message: 'first msg' },
            { path: ['second'], message: 'second msg' },
          ],
        },
      }),
    };

    const validator = new ZodValidation(fakeSchema as any);

    const result = validator.validate({});

    expect(result.map((r) => r.message)).toEqual(['first msg', 'second msg']);
  });

  it('returns empty array if safeParse returns success but includes data', () => {
    const fakeSchema: FakeZodSchema<any> = {
      safeParse: jest.fn().mockReturnValue({ success: true, data: { a: 1 } }),
    };

    const validator = new ZodValidation(fakeSchema as any);

    const result = validator.validate({ a: 1 });
    expect(result).toEqual([]);
  });

  it('handles non-string path segments by converting them to strings (joins with dot)', () => {
    const fakeSchema: FakeZodSchema<any> = {
      safeParse: jest.fn().mockReturnValue({
        success: false,
        error: {
          errors: [
            { path: ['items', 0, 'value'], message: 'Invalid item value' },
            { path: ['0start'], message: 'Edge case' },
          ],
        },
      }),
    };

    const validator = new ZodValidation(fakeSchema as any);

    const result = validator.validate({});
    expect(result).toEqual([
      { field: 'items.0.value', message: 'Invalid item value' },
      { field: '0start', message: 'Edge case' },
    ]);
  });
});
