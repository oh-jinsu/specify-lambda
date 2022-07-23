import { MESSAGE, STATUS_CODE } from "./constants";

export const Exception = (statusCode: number, message: string) => (target: any) => {
  target.prototype[STATUS_CODE] = statusCode;
  target.prototype[MESSAGE] = message;
};
