export class NotFoundError extends Error {
  constructor(
    message: string,
    public readonly status = 404,
  ) {
    super(message);
  }
}
