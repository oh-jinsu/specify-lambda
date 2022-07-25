import { enhanceRequest, requestSelector } from "../../../core/mappers/request";
import { BadRequestException } from "../../exceptions";
import { ALIAS_BODY } from "./constants";

export const Query = (key: string) => (target: any, name: string) =>
  enhanceRequest(requestSelector(name)((event) => event.queryStringParameters?.[key]))(target);

export const Path = (key: string) => (target: any, name: string) => enhanceRequest(requestSelector(name)((event) => event.pathParameters?.[key]))(target);

export const Body = (key?: string) => (target: any, name: string) =>
  enhanceRequest((event, context, value) => {
    if (!value[ALIAS_BODY]) {
      if (!event.body) {
        value[ALIAS_BODY] = {};
      } else {
        value[ALIAS_BODY] = JSON.parse(event.body);
      }
    }

    if (key) {
      const result = (value[ALIAS_BODY] as Record<string, unknown>)[key];

      return {
        ...value,
        [name]: result,
      };
    }

    const result = value[ALIAS_BODY];

    delete value[ALIAS_BODY];

    return {
      ...value,
      [name]: result,
    };
  })(target);

export const Header = (key: string) => (target: any, name: string) => enhanceRequest(requestSelector(name)((event) => event.headers?.[key]))(target);

export const BearerAuth = () => (target: any, name: string) =>
  enhanceRequest(requestSelector(name)((event) => event.headers?.["Authorization"]?.replace("Bearer ", "")))(target);

export const Cookie = (key: string) => (target: any, name: string) =>
  enhanceRequest(
    requestSelector(name)((event) => {
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
    enhanceRequest(
      requestSelector(name)((_, __, value) => {
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
      return false;
    }

    return Boolean(item);
  });
