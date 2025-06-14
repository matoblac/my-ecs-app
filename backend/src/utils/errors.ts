// backend/src/utils/error.ts


// This file is used to handle errors in the application.


export class DomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DomainError'
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string) {
    super(`${resource} not found`)
    this.name = 'NotFoundError'
  }
}

export class DatabaseError extends Error {
  original: unknown

  constructor(message: string, original?: unknown) {
    super(message)
    this.name = 'DatabaseError'
    this.original = original
  }
}
