import { CustomerEntityToDtoMapper } from '@/core/infrastructure/mappers';
import { Customer } from '@/core/domain/customers/customer.entity';

describe('CustomerEntityToDtoMapper', () => {
  let mapper: CustomerEntityToDtoMapper;

  beforeEach(() => {
    mapper = new CustomerEntityToDtoMapper();
  });

  it('should map a Customer entity to CustomerDto', () => {
    const createdAt = new Date('2024-01-01T10:00:00.000Z');
    const lastVisitAt = new Date('2024-01-05T15:30:00.000Z');

    const entity = new Customer({
      name: 'John Doe',
      phone: '555-9999',
      points: 120,
      createdAt,
      lastVisitAt,
    });

    entity.setId(10);

    const dto = mapper.map(entity);

    expect(dto.id).toBe(10);
    expect(dto.name).toBe('John Doe');
    expect(dto.phone).toBe('555-9999');
    expect(dto.points).toBe(120);
    expect(dto.createdAt).toBe(createdAt.toISOString());
    expect(dto.lastVisitAt).toBe(lastVisitAt.toISOString());
  });

  it('should map even if id is not set', () => {
    const createdAt = new Date('2023-03-01T12:00:00.000Z');
    const entity = new Customer({
      name: 'Alice',
      phone: '99999-0000',
      points: 50,
      createdAt,
    });

    const dto = mapper.map(entity);

    expect(dto.id).toBeUndefined();
    expect(dto.name).toBe('Alice');
    expect(dto.phone).toBe('99999-0000');
    expect(dto.points).toBe(50);
    expect(dto.createdAt).toBe(createdAt.toISOString());
    expect(typeof dto.lastVisitAt).toBe('string');
  });

  it('should not mutate the original Customer entity', () => {
    const createdAt = new Date('2024-04-01T08:00:00.000Z');
    const lastVisitAt = new Date('2024-04-02T10:00:00.000Z');

    const entity = new Customer({
      name: 'Bob',
      phone: '4444-2222',
      points: 10,
      createdAt,
      lastVisitAt,
    });

    entity.setId(123);

    const snapshotBefore = {
      id: entity.id,
      name: entity.name,
      phone: entity.phone,
      points: entity.points,
      createdAt: entity.createdAt.getTime(),
      lastVisitAt: entity.lastVisitAt.getTime(),
    };

    mapper.map(entity);

    expect(entity.id).toBe(snapshotBefore.id);
    expect(entity.name).toBe(snapshotBefore.name);
    expect(entity.phone).toBe(snapshotBefore.phone);
    expect(entity.points).toBe(snapshotBefore.points);
    expect(entity.createdAt.getTime()).toBe(snapshotBefore.createdAt);
    expect(entity.lastVisitAt.getTime()).toBe(snapshotBefore.lastVisitAt);
  });

  it('should map correctly when createdAt and lastVisitAt are the same moment', () => {
    const now = new Date();
    const entity = new Customer({
      name: 'Same Time',
      phone: '7777-7777',
      points: 0,
      createdAt: new Date(now),
      lastVisitAt: new Date(now),
    });

    entity.setId(1);

    const dto = mapper.map(entity);

    expect(dto.createdAt).toBe(now.toISOString());
    expect(dto.lastVisitAt).toBe(now.toISOString());
  });
});
