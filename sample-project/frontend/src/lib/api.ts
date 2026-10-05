export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

/** JSON fetch against the backend. Pass `body` as an object, or as FormData for uploads. */
export async function api<T = unknown>(path: string, { method = 'GET', body }: { method?: string; body?: unknown } = {}) {
  const isForm = body instanceof FormData
  const res = await fetch(`/api${path}`, {
    method,
    credentials: 'same-origin',
    headers: body !== undefined && !isForm ? { 'Content-Type': 'application/json' } : undefined,
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  })
  if (res.status === 204) return null as T
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(data.error || 'Ocorreu um erro inesperado.', res.status)
  return data as T
}

export const errorMessage = (err: unknown) => (err instanceof Error ? err.message : 'Ocorreu um erro inesperado.')
