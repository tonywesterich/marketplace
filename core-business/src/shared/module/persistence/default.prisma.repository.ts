import { AlreadyExistsException } from '@app/shared/core/exeption/already-exists.exception';
import { NotFoundException } from '@app/shared/core/exeption/not-found.exception';
import {
  PersistenceClientException,
  PersistenceInternalException,
} from '@app/shared/core/exeption/storage.exception';
import { Injectable } from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Injectable()
export abstract class DefaultPrismaRepository {
  protected handleAndThrowError(error: unknown): never {
    if (error instanceof PrismaClientValidationError) {
      throw new PersistenceClientException(error.message);
    }

    this.checkAlreadExistsError(error);
    this.checkNotFoundError(error);

    const errorMessage = this.extractErrorMessage(error);
    throw new PersistenceInternalException(errorMessage);
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return 'An unexpected error occurred.';
  }

  private checkAlreadExistsError(error: unknown): void {
    if (this.isAlreadyExistsError(error)) {
      throw new AlreadyExistsException('Customer already exists');
    }
  }

  private isAlreadyExistsError(error: unknown): boolean {
    return error instanceof Error && !!error.message?.match(/unique/i);
  }

  private checkNotFoundError(error: unknown): void {
    if (this.isNotFoundError(error)) {
      throw new NotFoundException('Customer not found');
    }
  }

  private isNotFoundError(error: unknown): boolean {
    return (
      error instanceof PrismaClientKnownRequestError && error.code === 'P2025'
    );
  }
}
