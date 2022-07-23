export interface TypeOf<T> { new(): T; }

export type Result = { statusCode: number, headers?: Record<string, string>, body: Record<string, any>}

export type PlainResult = { statusCode: number, headers?: Record<string, string>, body: string}

export type Lambda<T, K> = (params: T) => Promise<K> 