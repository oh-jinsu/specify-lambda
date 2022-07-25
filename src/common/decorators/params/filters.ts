import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { calculateParams, enhanceRequest, requestSelector } from "../../../core/mappers/request";
import { GenericOf } from "../../../core/types";
import { BadRequestException } from "../../exceptions";
import { ALIAS_BODY } from "./constants";

type Filter<T> = (value: unknown, event: APIGatewayProxyEvent, context: Context) => T;

export const Is =
  <T>(filter: Filter<T>) =>
  (target: any, name: string) =>
    enhanceRequest(requestSelector(name)((event, context, value) => filter(value, event, context)))(target);

const validator =
  <T>(validate: (value: unknown) => boolean): Filter<T | unknown> =>
  (value): T | unknown => {
    if (!value) {
      return value;
    }

    if (validate(value)) {
      return value as T;
    }

    throw new BadRequestException();
  };

export const required: Filter<unknown> = (_, __, value) => {
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
  <T>(filter?: Filter<T>): Filter<T[] | unknown> =>
  (event, context, array) => {
    if (!array) {
      return array;
    }

    if (!Array.isArray(array)) {
      throw new BadRequestException();
    }

    if (!filter) {
      return array;
    }

    return array.map((item) => filter(event, context, item));
  };

export const IsBooleanArray = () => Is(arrayOf(ofBoolean));

export const IsStringArray = () => Is(arrayOf(ofString));

export const IsNumberArray = () => Is(arrayOf(ofNumber));

export const oneOf = (array: readonly unknown[]) => validator((value) => array.includes(value));

export const IsOneOf = (array: readonly unknown[]) => Is(oneOf(array));

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
  <T>(type: GenericOf<T>): Filter<T | unknown> =>
  (value, event, context) => {
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
