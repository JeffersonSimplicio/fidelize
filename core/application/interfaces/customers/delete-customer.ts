export interface IDeleteCustomer {
  execute(id: number): Promise<boolean>;
}