// backend/src/utils/errors.ts

// This file is used to handle errors in the application.

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name; // Ensures correct instanceof check
    Object.setPrototypeOf(this, new.target.prototype); 
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string) {
    super(`${resource} not found`);
  }
}

export class DatabaseError extends DomainError {
  original: unknown;
  constructor(message: string, original?: unknown) {
    super(message);
    this.original = original;
  }
}

// Type guard to check if an unknown value is an Error
export function isError(err: unknown): err is Error {
  return err instanceof Error || 
         (typeof err === 'object' && err !== null && 'message' in err && 'name' in err);
}