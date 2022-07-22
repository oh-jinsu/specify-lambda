import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Handler } from "aws-lambda";

export interface TypeOf<T> { new(): T; }

export type ResponseSpec = { statusCode: number, headers: Record<string, string>, body: any }

export type ProxyHandler = Handler<APIGatewayProxyEventV2, APIGatewayProxyResultV2>
