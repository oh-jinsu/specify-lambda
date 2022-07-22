import { EXECUTOR, REQUEST_FILTERS } from "./constants";
import { Exception } from "./exception";
import { ProxyHandler, ResponseSpec, TypeOf } from "./types";

abstract class ILambda<T, K extends ResponseSpec> {
  handler: ProxyHandler

  abstract execute(params: T): Promise<K>
} 

export const Lambda = <T, K extends ResponseSpec>(request: TypeOf<T>, response: TypeOf<K>) => {
  ILambda.prototype.handler = async (event, context) => {
    try {
      const executor = (ILambda.prototype as any)[EXECUTOR]

      if (!executor) {
        return null
      }
  
      const filters = request.prototype[REQUEST_FILTERS]
  
      if (!filters) {
        return executor({});
      }
  
      const args: Record<string, any> = {}
  
      for (const key in filters) {
        args[key] = filters[key](event, context)
      }

      const result = await executor(args)

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

  return ILambda<T, K>
}

export const Executor = () => (target: any, key: any, _: any) => {
  Object.getPrototypeOf(target.constructor.prototype)[EXECUTOR] = target[key]
}
