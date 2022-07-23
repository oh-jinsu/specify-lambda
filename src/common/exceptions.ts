import { Exception } from "../core/exception";

@Exception(500, "무언가 잘못됐어요")
export class InternalServerError {}

@Exception(501, "너무 많은 요청을 보내고 있어요.")
export class NotImplementedError {}

@Exception(503, "잠깐 문제가 있어요.")
export class ServiceUnavailableError {}

@Exception(400, "유효하지 않은 요청이에요.")
export class BadRequestException {}

@Exception(401, "인증정보가 유효하지 않아요.")
export class UnauthorizedException {}

@Exception(402, "결제가 필요해요.")
export class PaymentRequiredException {}

@Exception(403, "권한이 없어요.")
export class ForbiddenException {}

@Exception(404, "결과를 찾지 못했어요.")
export class NotFoundException {}

@Exception(405, "허용하지 않은 메소드에요.")
export class MethodNotAllowed {}

@Exception(409, "지금은 맞지 않은 상태에요.")
export class ConflictException {}

@Exception(413, "너무 커다란 요청이에요.")
export class PayloadTooLargeException {}

@Exception(429, "너무 많은 요청을 보내고 있어요.")
export class TooManyRequestsException {}
