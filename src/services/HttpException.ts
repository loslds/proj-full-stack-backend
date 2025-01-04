export class HttpException extends Error {
  status: number;
  message: string;
  constructor(
    status: number,
    message: string | Record<any, any> = 'unspecified_error',
    stack = 'HttpException',
  ) {
    const msg =
      typeof message === 'string'
        ? message
        : message
          ? JSON.stringify(message)
          : JSON.stringify(stack || {});
    super(msg);
    this.status = status;
    this.message = msg;
    this.stack = stack;
  }
}

export enum ErrMsg {
  // general
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
