# Write your explicit Lambda function

```ts
// index.ts

import { Lambda, Executor Query } from "specify-lambda"

class RequestSpec {
  @Query("username")
  username: string;
}

class ResponseSpec {
  readonly statusCode: 200

  readonly headers: Record<string, string>

  readonly body: any
}

class MyLambda extends Lambda(RequestSpec, ResponseSpec) {
  @Executor()
  async execute({ username }: RequestSpec): Promise<ResponseSpec> {
    const message = `Hello ${username || "world"}!`

    return {
      statusCode: 200,
      headers: {},
      body: { message },
    }
  }
}

export const handler = new MyLambda().handler
```