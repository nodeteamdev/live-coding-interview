import { isObject, isString } from '@nestjs/common/utils/shared.utils';

export default class WsException extends Error {
  constructor(private readonly error: string | object) {
    super();
    this.initMessage();
  }

  public initMessage() {
    if (isString(this.error)) {
      this.message = this.error;
    } else if (
      isObject(this.error)
      && isString((this.error as Record<string, any>).message)
    ) {
      this.message = (this.error as Record<string, any>).message;
    }
  }

  public getError(): string | object {
    return this.error;
  }
}
