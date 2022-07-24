import { mapRequest as map, selectParam as select } from "../../../core/mappers";
import { BadRequestException } from "../../exceptions";

export const Required = () => (target: any, name: string) =>
  map(
    select(name)((_, __, value) => {
      if (!value) {
        throw new BadRequestException();
      }

      return value;
    }),
  )(target);

export const Is = (assertion: (value: unknown) => boolean) => (target: any, name: string) =>
  map(
    select(name)((_, __, value) => {
      if (!value) {
        return value;
      }

      if (!assertion(value)) {
        throw new BadRequestException();
      }

      return value;
    }),
  )(target);

const booleanValidator = (value: unknown) => typeof value === "boolean";

export const IsBoolean = () => Is(booleanValidator);

const stringValidator = (value: unknown) => typeof value === "string";

export const IsString = () => Is(stringValidator);

const numberValidator = (value: unknown) => !isNaN(Number(value));

export const IsNumber = () => Is(numberValidator);

export const IsArray = (validate?: (value: unknown, index: number, array: unknown[]) => boolean) =>
  Is((value) => {
    if (!Array.isArray(value)) {
      return false;
    }

    if (!validate) {
      return true;
    }

    return value.every(validate);
  });

export const IsBooleanArray = () => IsArray(booleanValidator);

export const IsStringArray = () => IsArray(stringValidator);

export const IsNumberArray = () => IsArray(numberValidator);

const objectValidadator = (value: unknown) => typeof value === "object" && !Array.isArray(value);

export const IsObject = () => Is(objectValidadator);

export const IsObjectArray = () => IsArray(objectValidadator);

export const IsOneOf = (array: unknown[]) => Is((value) => array.includes(value));

export const IsMatched = (regex: RegExp) =>
  Is((value) => {
    if (typeof value !== "string") {
      return false;
    }

    return regex.test(value);
  });

export const IsEmail = () =>
  IsMatched(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);
