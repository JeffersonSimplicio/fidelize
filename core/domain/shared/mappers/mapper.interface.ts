export interface Mapper<TInput, TOutput> {
  map(input: TInput): TOutput;
}
