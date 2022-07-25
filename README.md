# Write your explicit Lambda function

```ts
// index.ts

import { specify, Get, Query, StatusCode, SnakeCase } from "specify-lambda"

@Get()
export class Request {
  @Query("username")
  username: string;
}

@StatusCode(200)
export class Response {
  @SnakeCase()
  readonly body: {
    readonly message: string
  }
}

export const handler = specify(
  Request,
  Response,
)(async ({ username }) => {
  const message = `Hello ${username || "world"}!`
  
  return {
    body: { message },
  }
})
```