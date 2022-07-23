export interface TypeOf<T> { new(): T; }

export type Result<T> = { statusCode: number, headers?: Record<string, string>, body: T }

export type Lambda<T, K> = (params: T) => Promise<Result<K>> 