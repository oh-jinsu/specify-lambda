import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { ALIAS_PROPERTY_VALUE_MAPPER, ALIAS_CLASS_VALDIATOR } from "./constants";

type Mapper = (event: APIGatewayProxyEvent, context: Context) => any;

export const PropertyValueMapper = (value: Mapper) => (target: any, name: string) => {
  target[ALIAS_PROPERTY_VALUE_MAPPER] ??= {};

  target[ALIAS_PROPERTY_VALUE_MAPPER][name] = value;
};

type Validator = (event: APIGatewayProxyEvent, context: Context) => void;

export const ClassValidator = (name: string) => (value: Validator) => (target: any) => {
  target.prototype[ALIAS_CLASS_VALDIATOR] ??= {};

  target.prototype[ALIAS_CLASS_VALDIATOR][name] = value;
};
