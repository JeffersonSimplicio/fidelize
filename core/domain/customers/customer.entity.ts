export type Customer = {
  id: number;
  name: string;
  phone: string;
  points: number;
  lastVisitAt: Date;
  createdAt: Date;
}

export type CustomerCreateProps = Omit<Customer, 'id'>;

export type CustomerUpdateProps = Partial<Omit<Customer, 'id' | 'createdAt'>>;