import { ALIAS_PROPERTY_VALUE_MAPPER } from "../../core/constants";
import { PropertyValueMapper } from "../../core/decorator";
import { BadRequestException } from "../exceptions";

export const Query = (key: string) => PropertyValueMapper((event) => event.queryStringParameters?.[key]);

export const Path = (key: string) => PropertyValueMapper((event) => event.pathParameters?.[key]);

export const Body = (key: string) =>
  PropertyValueMapper((event) => {
    if (!event.body) {
      return;
    }

    return JSON.parse(event.body)[key];
  });

export const Header = (key: string) => PropertyValueMapper((event) => event.headers?.[key]);

export const BearerAuth = () =>
  PropertyValueMapper((event) => {
    const authorization = event.headers?.["Authorization"];

    if (!authorization) {
      return null;
    }

    return authorization.replace("Bearer ", "");
  });

export const Cookie = (key: string) =>
  PropertyValueMapper((event) => {
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
  });

export const Required = () => (target: any, name: string) => {
  const filter = target[ALIAS_PROPERTY_VALUE_MAPPER]?.[name];

  if (!filter) {
    return;
  }

  return PropertyValueMapper((event, context) => {
    const result = filter(event, context);

    if (!result) {
      throw new BadRequestException();
    }

    return result;
  })(target, name);
};
