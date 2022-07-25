import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { calculateParams, enhanceRequest, requestSelector } from "../../../core/mappers/request";
import { GenericOf } from "../../../core/types";
import { BadRequestException } from "../../exceptions";
import { ALIAS_BODY } from "./constants";

type Mapper<T> = (event: APIGatewayProxyEvent, context: Context, value: unknown) => T;

export const Is =
  <T>(mapper: Mapper<T>) =>
  (target: any, name: string) =>
    enhanceRequest(requestSelector(name)(mapper))(target);

const validator =
  <T>(validate: (value: unknown) => boolean): Mapper<T | unknown> =>
  (event, context, value): T | unknown => {
    if (!value) {
      return value;
    }

    if (validate(value)) {
      return value as T;
    }

    throw new BadRequestException();
  };

export const required: Mapper<unknown> = (_, __, value) => {
  if (!value) {
    throw new BadRequestException();
  }

  return value;
};

export const Required = () => Is(required);

const ofBoolean = validator<boolean>((value) => typeof value === "boolean");

export const IsBoolean = () => Is(ofBoolean);

const ofString = validator<string>((value) => typeof value === "string");

export const IsString = () => Is(ofString);

const ofNumber = validator<number>((value) => typeof value === "number");

export const IsNumber = () => Is(ofNumber);

export const arrayOf =
  <T>(mapper?: Mapper<T>): Mapper<T[] | unknown> =>
  (event, context, array) => {
    if (!array) {
      return array;
    }

    if (!Array.isArray(array)) {
      throw new BadRequestException();
    }

    if (!mapper) {
      return array;
    }

    return array.map((item) => mapper(event, context, item));
  };

export const IsBooleanArray = () => Is(arrayOf(ofBoolean));

export const IsStringArray = () => Is(arrayOf(ofString));

export const IsNumberArray = () => Is(arrayOf(ofNumber));

export const IsOneOf = (array: unknown[]) => Is(validator((value) => array.includes(value)));

export const IsMatched = (regex: RegExp) =>
  Is(
    validator((value) => {
      if (typeof value !== "string") {
        return false;
      }

      return regex.test(value);
    }),
  );

export const IsEmail = () =>
  IsMatched(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);

export const nestedOf =
  <T>(type: GenericOf<T>): Mapper<T | unknown> =>
  (event, context, value) => {
    if (!value) {
      return value;
    }

    if (typeof value !== "object" || Array.isArray(value)) {
      throw new BadRequestException();
    }

    return calculateParams(event, context, { [ALIAS_BODY]: value }, type) || new type();
  };

export const IsNested = <T>(type: GenericOf<T>) => Is(nestedOf(type));

export const IsNestedArray = <T>(type: GenericOf<T>) => Is(arrayOf(nestedOf(type)));
