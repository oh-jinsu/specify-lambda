import { Result, GenericOf } from "../types";

const ALIAS_RESPONSE_MAPPER = "__response_mapper";

export const calculateResult = <T extends Result>(result: T, target: GenericOf<T>): T => target.prototype[ALIAS_RESPONSE_MAPPER]?.(result);

export type ResponseReducer = (value: Result) => Result;

export const enhanceResponse = (reducer: ResponseReducer) => (target: any) => {
  const prev = target[ALIAS_RESPONSE_MAPPER] as ResponseReducer;

  const next: ResponseReducer = (value) => reducer(prev?.(value) || value);

  target[ALIAS_RESPONSE_MAPPER] = next;
};

export type ResponseSelectorMapper<T extends keyof Result, K extends Result[T] = Result[T]> = (result: K) => K;

export const responseSelector =
  <T extends keyof Result>(key: T) =>
  (mapper: ResponseSelectorMapper<T>): ResponseReducer =>
  (value) => {
    const prev = value[key];

    const result = mapper(prev);

    return {
      ...value,
      [key]: result,
    };
  };
