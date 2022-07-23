import { ClassValidator } from "../../core/decorator";
import { MethodNotAllowed } from "../exceptions";

export const Method = (value: string) =>
  ClassValidator("__METHOD")((event) => {
    if (event.httpMethod.toLowerCase() !== value.toLowerCase()) {
      throw new MethodNotAllowed();
    }
  });

export const Get = () => Method("GET");

export const Post = () => Method("POST");

export const Put = () => Method("PUT");

export const PATCH = () => Method("PATCH");

export const DELETE = () => Method("DELETE");
