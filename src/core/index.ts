export * from "./exception";

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { Exception } from "./exception";
import { calculateParams } from "./mappers/request";
import { calculateResult } from "./mappers/response";
import { Lambda, Result, GenericOf } from "./types";

export const specify =
  <T, K extends Result>(request: GenericOf<T>, response: GenericOf<K>) =>
  (lambda: Lambda<T, K>) =>
  async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
      const params = calculateParams(event, context, {}, request) || new request();

      const result = await lambda(params, event, context);

      const { statusCode, headers, body } = calculateResult(result, response) || result;

      return {
        statusCode: statusCode || 200,
        headers,
        body: body ? JSON.stringify(body) : "",
      };
    } catch (error: any) {
      if (error instanceof Exception) {
        const { statusCode, message, headers } = error;

        return {
          statusCode,
          headers,
          body: JSON.stringify({
            message,
          }),
        };
      }

      const { message } = error;

      return {
        statusCode: 500,
        body: JSON.stringify({ message }),
      };
    }
  };
