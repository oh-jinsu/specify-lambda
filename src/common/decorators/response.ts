/* eslint-disable @typescript-eslint/no-unused-vars */

import { enhanceResponse, responseSelector } from "../../core/mappers";

export const StatusCode = (code: number) => (target: any) =>
  enhanceResponse((value) => {
    if (code === 204) {
      return {
        ...value,
        statusCode: code,
      };
    }

    return {
      ...value,
      statusCode: code,
    };
  })(target.prototype);

export const SnakeCase = () => (target: any, name: string) =>
  enhanceResponse(
    responseSelector("body")((value) => {
      const toSnakeCase = (value: any): any => {
        if (value === null || value === undefined) {
          return undefined;
        }

        if (Array.isArray(value)) {
          return value.map(toSnakeCase);
        }

        if (value.constructor === Object) {
          const result: Record<string, any> = {};

          Object.entries(value).forEach(([key, value]) => {
            const mappedKey = key.replace(/[a-z][A-Z]/g, ([first, second]) => {
              return `${first}_${second.toLowerCase()}`;
            });

            result[mappedKey] = toSnakeCase(value);
          });

          return result;
        }

        return value;
      };

      return toSnakeCase(value);
    }),
  )(target);
