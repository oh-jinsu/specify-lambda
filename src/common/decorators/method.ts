import { enhanceRequest } from "../../core/mappers/request";
import { MethodNotAllowed } from "../exceptions";

export const Method = (key: string) => (target: any) =>
  enhanceRequest((event, context, value) => {
    if (event.httpMethod.toLowerCase() !== key.toLowerCase()) {
      throw new MethodNotAllowed(`${key} 메소드는 허용하지 않아요.`);
    }

    return value;
  })(target.prototype);

export const Get = () => Method("GET");

export const Post = () => Method("POST");

export const Put = () => Method("PUT");

export const PATCH = () => Method("PATCH");

export const DELETE = () => Method("DELETE");
