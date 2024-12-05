export class apiResponse {
  constructor (code, message, data) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
}