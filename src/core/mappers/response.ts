import { Result, GenericOf } from "../types";

const ALIAS_RESPONSE_MAPPER = "__response_mapper";

export type ResponseMapper = (value: Result) => Result;

export const calculateResult = <T>(spec: GenericOf<T>, result: T): T => spec.prototype[ALIAS_RESPONSE_MAPPER](result);

export const map = (mapper: ResponseMapper) => (target: any) => {
  const prev = target[ALIAS_RESPONSE_MAPPER] as ResponseMapper;

  const next: ResponseMapper = (value) => {
    return mapper(prev?.(value) || value);
  };

  target[ALIAS_RESPONSE_MAPPER] = next;
};

type PropertyMapper<T extends keyof Result, K extends Result[T] = Result[T]> = (result: K) => K;

export const select =
  <T extends keyof Result>(key: T) =>
  (mapper: PropertyMapper<T>): ResponseMapper =>
  (value) => {
    const prev = value[key];

    const result = mapper(prev);

    return {
      ...value,
      [key]: result,
    };
  };
