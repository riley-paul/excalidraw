import { GraphQLError } from "graphql";

const codeToStatus = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  PRECONDITION_FAILED: 412,
  CONTENT_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  LOCKED: 423,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  INSUFFICIENT_STORAGE: 507,
} as const;

export type ActionErrorCode = keyof typeof codeToStatus;

export type ActionErrorOptions = {
  code: ActionErrorCode;
  message?: string;
};

/**
 * Extends `GraphQLError` so GraphQL Yoga sends the message and code to the
 * client as-is. Yoga replaces any other error with "Unexpected error.".
 */
export class ActionError extends GraphQLError {
  readonly code: ActionErrorCode;
  readonly status: number;

  constructor({ code, message }: ActionErrorOptions) {
    const status = codeToStatus[code];
    super(message ?? code, { extensions: { code, status } });
    this.name = "ActionError";
    this.code = code;
    this.status = status;
  }
}
