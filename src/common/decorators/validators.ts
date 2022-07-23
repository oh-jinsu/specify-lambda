import { APIGatewayProxyEventV2, Context } from "aws-lambda"
import { REQUEST_VALIDATOR } from "../../core/constants"
import { BadRequestException } from "../exceptions"

type Validator = (event: APIGatewayProxyEventV2, context: Context) => void

const RequestValidator = (name: string) => (validator: Validator) => (target: any) => {
  target[REQUEST_VALIDATOR] ??= {}

  target[REQUEST_VALIDATOR][name] = validator
}

export const Method = (value: string) => RequestValidator("__METHOD")((event) => {
  if (event.requestContext.http.method.toLowerCase() !== value.toLowerCase()) {
    throw new BadRequestException()
  }
})