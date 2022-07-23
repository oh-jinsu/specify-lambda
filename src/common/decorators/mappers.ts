import { APIGatewayProxyEventV2, Context } from "aws-lambda"
import { REQUEST_MAPPER } from "../../core/constants"
import { BadRequestException } from "../exceptions"

type Mapper = (event: APIGatewayProxyEventV2, context:Context) => any

const RequestMapper = (mapper: Mapper) => (target: any, name: string) => {
  target[REQUEST_MAPPER] ??= {}

  target[REQUEST_MAPPER][name] = mapper
}

export const Query = (key: string) => RequestMapper((event) => event.queryStringParameters?.[key])

export const Path = (key: string) => RequestMapper((event) => event.pathParameters?.[key])

export const Body = (key: string) => RequestMapper((event) => {
  if (!event.body) {
    return
  }

  return JSON.parse(event.body)[key]
})

export const Header = (key: string) => RequestMapper((event) => event.headers?.[key])

export const Cookie = (key: string) => RequestMapper((event) => {
  if (!event.cookies) {
    return
  }
  
  for (const cookie of event.cookies) {
    if (cookie.startsWith(key)) {
      return cookie.replace(key, "")
    }
  }
})

export const Required = () => (target: any, name: string) => {
  const filter = target[REQUEST_MAPPER]?.[name]

  if (!filter) {
    return;
  }

  target[REQUEST_MAPPER][name] = (event: any, context: any) => {
    const result = filter(event, context)

    if (!result) {
      throw new BadRequestException()
    }

    return result
  }
}
