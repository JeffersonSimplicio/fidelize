export interface IValidation<T> {
  validate(input: T): ValidationError[];
}

export type ValidationError = {
  field: string;
  message: string;
};
