type CodeType = 'invalid' | 'expired';
export class MiddlewareError extends Error {
  public readonly message: string;

  public readonly code?: string;

  public readonly statusCode: number;

  constructor(message: string, statusCode = 400, code?: CodeType) {
    super();
    this.message = message;
    this.code = code;
    this.statusCode = statusCode;
  }
}
