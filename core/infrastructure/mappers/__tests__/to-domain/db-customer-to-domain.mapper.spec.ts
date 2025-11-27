import { DbCustomerToDomainMapper } from '@/core/infrastructure/mappers';
import { Customer } from '@/core/domain/customers/customer.entity';

const makeCustomerSelect = (overrides?: Partial<any>) => ({
  id: 1,
  name: 'John Doe',
  phone: '11999999999',
  points: 100,
  createdAt: new Date('2023-01-01T00:00:00Z'),
  lastVisitAt: new Date('2023-01-10T00:00:00Z'),
  ...overrides,
});

describe('DbCustomerToDomainMapper', () => {
  let mapper: DbCustomerToDomainMapper;

  beforeEach(() => {
    mapper = new DbCustomerToDomainMapper();
  });

  it('should map CustomerSelect to CustomerEntity correctly', () => {
    const input = makeCustomerSelect();
    const customerEntity = mapper.map(input);

    expect(customerEntity).toBeInstanceOf(Customer);
    expect(customerEntity.id).toBe(input.id);
    expect(customerEntity.name).toBe(input.name);
    expect(customerEntity.phone).toBe(input.phone);
    expect(customerEntity.points).toBe(input.points);
    expect(customerEntity.createdAt).toEqual(input.createdAt);
    expect(customerEntity.lastVisitAt).toEqual(input.lastVisitAt);
  });

  it("should correctly map id when it's zero", () => {
    const input = makeCustomerSelect({ id: 0 });
    const customerEntity = mapper.map(input);

    expect(customerEntity.id).toBe(0);
  });

  it('should correctly map points when zero', () => {
    const input = makeCustomerSelect({ points: 0 });
    const customerEntity = mapper.map(input);

    expect(customerEntity.points).toBe(0);
  });

  it('should throw an error if lastVisitAt is before createdAt', () => {
    const input = makeCustomerSelect({
      createdAt: new Date('2023-01-10T00:00:00Z'),
      lastVisitAt: new Date('2023-01-01T00:00:00Z'),
    });

    expect(() => mapper.map(input)).toThrow(
      'Última visita não pode ser antes da criação.',
    );
  });

  it('should map all string fields correctly when empty', () => {
    const input = makeCustomerSelect({ name: '', phone: '' });
    const customerEntity = mapper.map(input);

    expect(customerEntity.name).toBe('');
    expect(customerEntity.phone).toBe('');
  });
});
