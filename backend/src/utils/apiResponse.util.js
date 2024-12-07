export class apiResponse {
  constructor (code, message, data, role) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.role = role;
  }
}