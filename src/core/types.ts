import { APIGatewayEvent, Context } from "aws-lambda";

export interface GenericOf<T> {
  new (): T;
}

export type Result = { statusCode?: number; headers?: Record<string, string>; body?: Record<string, any> };

export type Lambda<T, K> = (params: T, event: APIGatewayEvent, context: Context) => Promise<K>;
