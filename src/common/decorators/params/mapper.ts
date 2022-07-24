/* eslint-disable @typescript-eslint/no-unused-vars */
import { calculateParams, map, select } from "../../../core/mappers/request";
import { GenericOf } from "../../../core/types";
import { BadRequestException } from "../../exceptions";

export const Query = (key: string) => (target: any, name: string) => map(select(name)((event) => event.queryStringParameters?.[key]))(target);

export const Path = (key: string) => (target: any, name: string) => map(select(name)((event) => event.pathParameters?.[key]))(target);

export const Body = (key: string) => (target: any, name: string) =>
  map(
    select(name)((event) => {
      if (!event.body) {
        return;
      }

      return JSON.parse(event.body)[key];
    }),
  )(target);

export const Header = (key: string) => (target: any, name: string) => map(select(name)((event) => event.headers?.[key]))(target);

export const BearerAuth = () => (target: any, name: string) => map(select(name)((event) => event.headers?.["Authorization"]?.replace("Bearer ", "")))(target);

export const Cookie = (key: string) => (target: any, name: string) =>
  map(
    select(name)((event) => {
      const cookies = event.headers?.["Cookie"];

      if (!cookies) {
        return;
      }

      for (const cookie of cookies.split(";")) {
        const row = cookie.trim();

        if (row.startsWith(key)) {
          return row.replace(key, "");
        }
      }
    }),
  )(target);

export const Parse =
  <T>(parser: (value: unknown) => T) =>
  (target: any, name: string) =>
    map(
      select(name)((_, __, value) => {
        const result: T = (() => {
          try {
            return parser(value);
          } catch {
            throw new BadRequestException();
          }
        })();

        if (!result) {
          throw new BadRequestException();
        }

        return result;
      }),
    )(target);

export const ToString = () => Parse<string>((value) => String(value));

export const ToNumber = () => Parse<number>((value) => Number(value));

export const ToArray = <T>(mapper: (item: string) => T) =>
  Parse<Array<T>>((value) => {
    if (typeof value !== "string") {
      throw new BadRequestException();
    }

    const items = value
      .replace(/^\[?.+\]$/, (substring) => {
        return substring.replace(/\[|\]/g, "");
      })
      .split(/\,\s?/)
      .map((item) => item.trim());

    return items.map(mapper);
  });

export const ToObject = <T = Record<string, any>>() =>
  Parse<T>((value) => {
    if (typeof value !== "string") {
      throw new BadRequestException();
    }

    return JSON.parse(value);
  });

export const ToStringArray = () =>
  ToArray((item) => {
    if (/("|')/g.test(item)) {
      return item.replace(/("|')/g, "");
    }

    return item;
  });

export const ToNumberArray = () =>
  ToArray((item) => {
    const result = Number(item);

    if (isNaN(result)) {
      throw new BadRequestException();
    }

    return result;
  });

export const ToBooleanArray = () =>
  ToArray((item) => {
    if (item === "false") {
      return true;
    }

    return Boolean(item);
  });

export type NestedBodyOptions<T> = {
  readonly type: GenericOf<T>;
};

export const NestedBody =
  <T>(key: string, { type }: NestedBodyOptions<T>) =>
  (target: any, name: string) =>
    map(
      select<T>(key)((event, context, value) => {
        if (!event.body) {
          return value;
        }

        const body = JSON.parse(event.body);

        const newevent = {
          ...event,
          body: JSON.stringify(body[key]),
        };

        return calculateParams(newevent, context, type);
      }),
    )(target);
