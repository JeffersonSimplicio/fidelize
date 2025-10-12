export interface DeleteCustomer {
  execute(id: number): Promise<void>;
}