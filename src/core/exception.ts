import { MESSAGE, STATUS_CODE } from "./constants";

export const Exception = (statusCode: number, message: string) => (target: any) => {
  target[STATUS_CODE] = statusCode;
  target[MESSAGE] = message;
};
