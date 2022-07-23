export * from "./exception"

import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { REQUEST_MAPPER, REQUEST_VALIDATOR } from "./constants";
import { Exception } from "./exception";
import { Lambda, PlainResult, Result, TypeOf } from "./types";

export const specify = <T, K extends Result>(request: TypeOf<T>, response: TypeOf<K>) => (lambda: Lambda<T, K>) => async (event: APIGatewayProxyEvent, context: Context): Promise<PlainResult> => {
  try {
    const validators = request.prototype[REQUEST_VALIDATOR]

    if (validators) {
      for (const key in validators) {
        validators[key](event, context)
      }        
    }

    const params = (() => {
      const mappers = request.prototype[REQUEST_MAPPER]

      if (!mappers) {
        return new request();
      }
  
      const result: Record<string, any> = {}
  
      for (const key in mappers) {
        result[key] = mappers[key](event, context)
      }

      return result
    })() as T

    const result = await lambda(params)

    const { statusCode, headers, body } = result

    if (body) {
      return {
        statusCode,
        headers,
        body: JSON.stringify(body)
      }
    }

    return {
      statusCode,
      headers,
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