export class ErrorResponse extends Error {
  constructor(public statusCode: number, public error?: string) {
    super(error);
  }
}

export type AppError = ErrorResponse & Record<string, unknown>;

/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorResponse:
 *       properties:
 *         statusCode:
 *           type: number
 *         error:
 *           type: string
 */
