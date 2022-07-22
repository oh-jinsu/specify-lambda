import { Exception } from "../core/exception";

export class BadRequestException extends Exception {
  constructor() { super(400, "유효하지 않은 요청입니다.") }
}
