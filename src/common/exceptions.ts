import { Exception } from "../core/exception";

export class InternalServerError extends Exception {
  constructor(message?: string, headers?: Record<string, string>) {
    super(500, message || "무언가 잘못됐어요.", headers);
  }
}

export class NotImplementedError extends Exception {
  constructor(message?: string, headers?: Record<string, string>) {
    super(501, message || "아직 구현하지 않았어요.", headers);
  }
}

export class ServiceUnavailableError extends Exception {
  constructor(message?: string, headers?: Record<string, string>) {
    super(503, message || "잠깐 문제가 있어요.", headers);
  }
}

export class BadRequestException extends Exception {
  constructor(message?: string, headers?: Record<string, string>) {
    super(400, message || "유효하지 않은 요청이에요.", headers);
  }
}

export class UnauthorizedException extends Exception {
  constructor(message?: string, headers?: Record<string, string>) {
    super(401, message || "인증이 필요해요.", headers);
  }
}

export class PaymentRequiredException extends Exception {
  constructor(message?: string, headers?: Record<string, string>) {
    super(402, message || "결제가 필요해요.", headers);
  }
}

export class ForbiddenException extends Exception {
  constructor(message?: string, headers?: Record<string, string>) {
    super(403, message || "권한이 없어요.", headers);
  }
}

export class NotFoundException extends Exception {
  constructor(message?: string, headers?: Record<string, string>) {
    super(404, message || "결과를 찾지 못했어요.", headers);
  }
}

export class MethodNotAllowed extends Exception {
  constructor(message?: string, headers?: Record<string, string>) {
    super(405, message || "허용하지 않은 메소드에요.", headers);
  }
}

export class ConflictException extends Exception {
  constructor(message?: string, headers?: Record<string, string>) {
    super(409, message || "지금은 맞지 않은 상태에요.", headers);
  }
}

export class PayloadTooLargeException extends Exception {
  constructor(message?: string, headers?: Record<string, string>) {
    super(413, message || "너무 커다란 요청이에요.", headers);
  }
}

export class TooManyRequestsException extends Exception {
  constructor(message?: string, headers?: Record<string, string>) {
    super(429, message || "너무 많은 요청을 보내고 있어요.", headers);
  }
}
