# Write your explicit Lambda function

```ts
// index.ts

import { specify, Get, Query } from "specify-lambda"

@Get()
export class Req {
  @Query("username")
  username: string;
}

export class Res {
  readonly statusCode: 200

  readonly body: {
    readonly message: string
  }
}

export const handler = specify(Req, Res)(async ({ username }) => {
  const message = `Hello ${username || "world"}!`
  
  return {
    statusCode: 200,
    body: { message },
  }
})
```