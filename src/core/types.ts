export interface GenericOf<T> {
  new (): T;
}

export type Result = { statusCode?: number; headers?: Record<string, string>; body?: Record<string, any> };

export type Lambda<T, K> = (params: T) => Promise<K>;
