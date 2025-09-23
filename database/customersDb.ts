import { Customer } from "../interfaces/customers";

// Nosso "mock" inicial
let customers: Customer[] = [
  { id: 1, name: "Ana Silva", phone: "(11) 91234-5678", points: 8, lastVisitAt: "2025-09-15" },
  { id: 2, name: "Carlos Santos", phone: "(21) 99876-5432", points: 3, lastVisitAt: "2025-09-20" },
  { id: 3, name: "Mariana Oliveira", phone: "(31) 98765-4321", points: 12, lastVisitAt: "2025-09-21" },
  { id: 4, name: "João Pereira", phone: "(81) 91234-1111", points: 0, lastVisitAt: "2025-09-05" },
  { id: 5, name: "Fernanda Costa", phone: "(85) 98888-2222", points: 6, lastVisitAt: "2025-09-18" },
  { id: 6, name: "Ricardo Almeida", phone: "(71) 97777-3333", points: 15, lastVisitAt: "2025-09-10" },
  { id: 7, name: "Juliana Rocha", phone: "(61) 96666-4444", points: 9, lastVisitAt: "2025-09-19" },
  { id: 8, name: "Paulo Henrique", phone: "(51) 95555-5555", points: 2, lastVisitAt: "2025-09-14" },
  { id: 9, name: "Luciana Martins", phone: "(41) 94444-6666", points: 11, lastVisitAt: "2025-09-16" },
  { id: 10, name: "Mateus Souza", phone: "(19) 93333-7777", points: 5, lastVisitAt: "2025-09-12" }
];

// Simula atraso do banco (200ms)
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

export const customersDb = {
  async getAll(): Promise<Customer[]> {
    await delay();
    return [...customers]; // retorna cópia
  },

  async getById(id: number): Promise<Customer | undefined> {
    await delay();
    return customers.find(c => c.id === id);
  },

  async add(customer: Omit<Customer, "id">): Promise<Customer> {
    await delay();
    const newCustomer: Customer = { ...customer, id: Date.now() }; // id fake
    customers.push(newCustomer);
    return newCustomer;
  },

  async update(id: number, data: Partial<Customer>): Promise<Customer | undefined> {
    await delay();
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) return undefined;

    customers[index] = { ...customers[index], ...data };
    return customers[index];
  },

  async remove(id: number): Promise<boolean> {
    await delay();
    const prevLength = customers.length;
    customers = customers.filter(c => c.id !== id);
    return customers.length < prevLength;
  }
};
