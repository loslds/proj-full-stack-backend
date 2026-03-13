
// src/exceptions/HttpException.ts
export class HttpException extends Error {
  public status: number;

  constructor(
    status: number,
    message: string | Record<string, any> = 'unknown_error'
  ) {
    const msg =
      typeof message === 'string'
        ? message
        : JSON.stringify(message);

    super(msg);
    this.status = status;
  }
}

export enum ErrMsg {
  unknown = 'unknown_error',
  invalidId = 'invalid_id',
  notFound = 'not_found',
  update = 'update_error',
  create = 'create_error',
  invalidToken = 'invalid_token',
  invalidDates = 'invalid_dates',
  badRequest = 'bad_request',
  recordCannotDuplicate = 'record_cannot_duplicate',
  emailDuplicated = 'email_duplicated',
  notRegistered = 'not_registered',
  disabledUser = 'disabled_user',
  unauthorizedGroup = 'unauthorized_access_group',
  invalidData = 'invalid_data',
  largeFile = 'too_large_file',
  emptyFile = 'empty_file',
}


