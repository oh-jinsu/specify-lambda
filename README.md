# Write your explicit Lambda function

```ts
// index.ts

import { specify, Query } from "specify-lambda"

export class RequestSpec {
  @Query("username")
  username: string;
}

export class ResponseSpec {
  readonly statusCode: 200

  readonly headers: Record<string, string>

  readonly body: any
}

export const handler = specify(RequestSpec, ResponseSpec)(async ({ username }) => {
  const message = `Hello ${username || "world"}!`
  
  console.log(username)
  
  return {
    statusCode: 200,
    headers: {},
    body: { message },
  }
})
```