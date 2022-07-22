# Write your explicit Lambda function

```ts
// spec.ts

import { Query } from "specify-lambda"

export class RequestSpec {
  @Query("username")
  username: string;
}

export class ResponseSpec {
  readonly statusCode: 200

  readonly headers: Record<string, string>

  readonly body: any
}

// lambda.ts

import { Executor, Lambda } from "specify-lambda"
import { RequestSpec, ResponseSpec } from "./spec";

export class MyLambda extends Lambda(RequestSpec, ResponseSpec) {
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

// index.ts (entrypoint)

import { MyLambda } from "./lambda"

export const handler = new MyLambda().handler
```