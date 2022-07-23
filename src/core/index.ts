/* eslint-disable @typescript-eslint/no-unused-vars */
export * from "./exception";

import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { MESSAGE, ALIAS_PROPERTY_VALUE_MAPPER, ALIAS_CLASS_VALDIATOR, STATUS_CODE, ALIAS_BODY_MAPPER } from "./constants";
import { Lambda, PlainResult, Result, TypeOf } from "./types";

export const specify =
  <T, K extends Result>(request: TypeOf<T>, response: TypeOf<K>) =>
  (lambda: Lambda<T, K>) =>
  async (event: APIGatewayProxyEvent, context: Context): Promise<PlainResult> => {
    try {
      const validators = request.prototype[ALIAS_CLASS_VALDIATOR];

      if (validators) {
        for (const key in validators) {
          validators[key](event, context);
        }
      }

      const params = (() => {
        const mappers = request.prototype[ALIAS_PROPERTY_VALUE_MAPPER];

        if (!mappers) {
          return new request();
        }

        const result: Record<string, any> = {};

        for (const key in mappers) {
          result[key] = mappers[key](event, context);
        }

        return result;
      })() as T;

      const result = await lambda(params);

      const { statusCode, headers, body } = result;

      if (!body) {
        return {
          statusCode,
          headers,
        };
      }

      const bodyMapper = response.prototype[ALIAS_BODY_MAPPER];

      if (bodyMapper) {
        return {
          statusCode,
          headers,
          body: JSON.stringify(bodyMapper(body)),
        };
      }

      return {
        statusCode,
        headers,
        body: JSON.stringify(body),
      };
    } catch (e: any) {
      if (STATUS_CODE in e && MESSAGE in e) {
        const statusCode = e[STATUS_CODE];

        const message = e[MESSAGE];

        return {
          statusCode,
          body: JSON.stringify({ message }),
        };
      }

      const { message } = e;

      return {
        statusCode: 500,
        body: JSON.stringify({ message }),
      };
    }
  };
