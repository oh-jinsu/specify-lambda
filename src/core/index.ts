export * from "./exception"

import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { REQUEST_FILTERS } from "./constants";
import { Exception } from "./exception";
import { Lambda, Result, TypeOf } from "./types";

export const specify = <T, K>(request: TypeOf<T>) => (lambda: Lambda<T, K>) => async (event: APIGatewayProxyEventV2, context: Context): Promise<Result<string>> => {
  try {
    const args = (() => {
      const filters = request.prototype[REQUEST_FILTERS]

      if (!filters) {
        return {};
      }
  
      const result: Record<string, any> = {}
  
      for (const key in filters) {
        result[key] = filters[key](event, context)
      }

      return result
    })() as T

    const result = await lambda(args)

    const { statusCode, headers, body } = result

    return {
      statusCode,
      headers,
      body: JSON.stringify(body),
    }
  } catch (e: any) {
    if (e instanceof Exception) {
      const { statusCode, message } = e

      return {
        statusCode,
        body: JSON.stringify({ message })
      }
    }

    const { message } = e
    
    return {
      statusCode: 500,
      body: JSON.stringify({ message })
    }
  }
}
