import { REQUEST_FILTERS } from "./constants";
import { Exception } from "./exception";
import { Lambda, ProxyHandler, ResponseSpec, TypeOf } from "./types";

export const specify = <T, K extends ResponseSpec>(request: TypeOf<T>, response: TypeOf<K>) => (lambda: Lambda<T, K>): ProxyHandler => async (event, context) => {
  try {
    const filters = request.prototype[REQUEST_FILTERS]

    if (!filters) {
      return lambda(new request());
    }

    const args: Record<string, any> = {}

    for (const key in filters) {
      args[key] = filters[key](event, context)
    }

    const result = await lambda(args as T)

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