export class Operation {
  httpMethod: string;
  url: string;
  body: any;

  constructor(httpMethod: string, url: string, body: any) {
    this.httpMethod = httpMethod;
    this.url = url;
    this.body = body;
  }
}

export enum HttpMethod {
  GET,
  HEAD,
  POST,
  PUT,
  PATCH,
  DELETE,
  OPTIONS,
  TRACE
}
