import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { GenericOf } from "../types";

export const ALIAS_REQUEST_MAPPER = "__request_mapper";

export const calculateParams = <T = unknown>(event: APIGatewayProxyEvent, context: Context, value: Record<string, unknown>, target: GenericOf<T>): T => {
  return target.prototype[ALIAS_REQUEST_MAPPER]?.(event, context, value, target);
};

export type RequestReducer = (
  event: APIGatewayProxyEvent,
  context: Context,
  value: Record<string, unknown>,
  target: GenericOf<unknown>,
) => Record<string, unknown>;

export const enhanceRequest = (reducer: RequestReducer) => (target: any) => {
  const prev = target[ALIAS_REQUEST_MAPPER] as RequestReducer;

  const next: RequestReducer = (event, context, value, target) => {
    const curr = prev?.(event, context, value, target) || value;

    return reducer(event, context, curr, target);
  };

  target[ALIAS_REQUEST_MAPPER] = next;
};

export type RequestSelectorMapper<T = unknown> = (event: APIGatewayProxyEvent, context: Context, value: T | undefined, target: GenericOf<unknown>) => T;

export const requestSelector =
  <T = unknown>(key: string) =>
  (mapper: RequestSelectorMapper<T>): RequestReducer =>
  (event, context, value, target) => {
    const prev = value[key] as T;

    const result = mapper(event, context, prev, target);

    return {
      ...value,
      [key]: result,
    };
  };
