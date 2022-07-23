import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { REQUEST_VALIDATOR } from "../../core/constants";
import { BadRequestException } from "../exceptions";

type Validator = (event: APIGatewayProxyEvent, context: Context) => void;

const RequestValidator = (name: string) => (validator: Validator) => (target: any) => {
  target.prototype[REQUEST_VALIDATOR] ??= {};

  target.prototype[REQUEST_VALIDATOR][name] = validator;
};

export const Method = (value: string) =>
  RequestValidator("__METHOD")((event) => {
    if (event.httpMethod.toLowerCase() !== value.toLowerCase()) {
      throw new BadRequestException();
    }
  });

export const Get = () => Method("GET");

export const Post = () => Method("POST");

export const Put = () => Method("PUT");

export const PATCH = () => Method("PATCH");

export const DELETE = () => Method("DELETE");
