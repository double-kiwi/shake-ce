import type { QueryParams } from './types';
import { getApiBaseUrl } from './config';

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body: unknown = undefined) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export function getAuthHeaders(): Record<string, string> {
  return {};
}

export function buildUrl(path: string, query?: QueryParams): string {
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${base}${normalizedPath}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

type RequestOptions = {
  query?: QueryParams;
  body?: unknown;
};

async function parseErrorBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return undefined;
  }
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

function messageFromBody(body: unknown, fallback: string): string {
  if (body === null || body === undefined) return fallback;
  if (typeof body === 'string') return body;
  if (typeof body === 'object' && 'message' in body) {
    const msg = (body as { message: unknown }).message;
    if (Array.isArray(msg)) return msg.join(', ');
    if (typeof msg === 'string') return msg;
  }
  return fallback;
}

async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    ...getAuthHeaders(),
  };

  const init: RequestInit = {
    method,
    headers,
  };

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(options.body);
  }

  const response = await fetch(buildUrl(path, options.query), init);

  if (!response.ok) {
    const body = await parseErrorBody(response);
    throw new ApiError(
      response.status,
      messageFromBody(body, response.statusText || `HTTP ${response.status}`),
      body,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  get: <T>(path: string, options?: Pick<RequestOptions, 'query'>) =>
    request<T>('GET', path, options),

  post: <T>(path: string, body: unknown, options?: Pick<RequestOptions, 'query'>) =>
    request<T>('POST', path, { ...options, body }),

  patch: <T>(path: string, body: unknown, options?: Pick<RequestOptions, 'query'>) =>
    request<T>('PATCH', path, { ...options, body }),

  delete: (path: string) => request<void>('DELETE', path),
};
