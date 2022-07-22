import { APIGatewayProxyEventV2, Context } from "aws-lambda"
import { REQUEST_FILTERS } from "../core/constants"
import { BadRequestException } from "./exceptions"

type Filter = (event: APIGatewayProxyEventV2, context:Context) => any

export const RequestFilter = (filter: Filter) => (target: any, name: string) => {
  target[REQUEST_FILTERS] ??= {}

  target[REQUEST_FILTERS][name] = filter
}

export const Query = (key: string) => RequestFilter((event) => event.queryStringParameters?.[key])

export const Path = (key: string) => RequestFilter((event) => event.pathParameters?.[key])

export const Body = (key: string) => RequestFilter((event) => {
  if (!event.body) {
    return null
  }

  return JSON.parse(event.body)[key]
})

export const Required = () => (target: any, name: string) => {
  const filter = target[REQUEST_FILTERS][name]

  target[REQUEST_FILTERS][name] = (event: any, context: any) => {
    const result = filter(event, context)

    if (!result) {
      throw new BadRequestException()
    }

    return result
  }
}
