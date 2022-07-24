import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { GenericOf } from "../types";

export const ALIAS_REQUEST_MAPPER = "__request_mapper";

export type RequestMapper<T = Record<string, unknown>> = (event: APIGatewayProxyEvent, context: Context, value: T) => T;

export const calculateParams = <T>(event: APIGatewayProxyEvent, context: Context, spec: GenericOf<T>): T =>
  spec.prototype[ALIAS_REQUEST_MAPPER](event, context, new spec());

export const map =
  <T>(mapper: RequestMapper<T>) =>
  (target: any) => {
    const prev = target[ALIAS_REQUEST_MAPPER] as RequestMapper<T>;

    const next: RequestMapper<T> = (event, context, value) => {
      return mapper(event, context, prev?.(event, context, value) || value);
    };

    target[ALIAS_REQUEST_MAPPER] = next;
  };

type ParamsMapper<T = unknown> = (event: APIGatewayProxyEvent, context: Context, value?: T) => T | undefined;

export const select =
  <T>(key: string) =>
  (mapper: ParamsMapper<T>): RequestMapper =>
  (event, context, value) => {
    const prev = value[key] as T;

    const result = mapper(event, context, prev);

    return {
      ...value,
      [key]: result,
    };
  };
