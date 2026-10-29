export class DomainError extends Error {
  constructor(
    message: string,
    readonly code: "NOT_FOUND" | "VALIDATION" | "OUT_OF_STOCK",
  ) {
    super(message);
    this.name = "DomainError";
  }
}

export const notFound = (what: string) => new DomainError(`${what} not found`, "NOT_FOUND");
export const invalid = (msg: string) => new DomainError(msg, "VALIDATION");
export const outOfStock = (productId: string) =>
  new DomainError(`Product ${productId} is out of stock`, "OUT_OF_STOCK");
