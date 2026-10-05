import { browserSupportsWebAuthn, startAuthentication, startRegistration } from '@simplewebauthn/browser'
import { api } from './api'

// Fingerprint (WebAuthn) ceremonies: the backend creates the options, the browser asks the OS for the
// fingerprint (Touch ID, Windows Hello…), and the backend verifies the signed result.

export const fingerprintSupported = () => browserSupportsWebAuthn()

/** A sensible default name for the credential being registered, e.g. "Mac · Chrome". */
export function defaultDeviceName() {
  const ua = navigator.userAgent
  const os = /iPhone|iPad/.test(ua)
    ? 'iPhone/iPad'
    : /Android/.test(ua)
      ? 'Android'
      : /Mac/.test(ua)
        ? 'Mac'
        : /Windows/.test(ua)
          ? 'Windows'
          : /Linux/.test(ua)
            ? 'Linux'
            : 'Computador'
  const browser = /Edg\//.test(ua) ? 'Edge' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : ''
  return browser ? `${os} · ${browser}` : os
}

function friendlyError(err: unknown, registering: boolean): Error {
  const name = err instanceof Error ? err.name : ''
  if (name === 'NotAllowedError') return new Error('A operação foi cancelada ou expirou. Tenta novamente.')
  if (name === 'InvalidStateError' && registering) return new Error('Este computador já está registado.')
  if (name === 'NotSupportedError' || name === 'SecurityError') {
    return new Error('Este browser ou computador não suporta impressão digital neste site.')
  }
  return err instanceof Error ? err : new Error('Não foi possível usar a impressão digital.')
}

/** Registers this device's fingerprint. `base` is the API prefix with `/options` and `/verify` endpoints. */
export async function registerFingerprint<T>(base: string, name: string): Promise<T> {
  const optionsJSON = await api<Parameters<typeof startRegistration>[0]['optionsJSON']>(`${base}/options`, { method: 'POST' })
  let response
  try {
    response = await startRegistration({ optionsJSON })
  } catch (err) {
    throw friendlyError(err, true)
  }
  return api<T>(`${base}/verify`, { method: 'POST', body: { response, name } })
}

/** Proves possession of an already registered fingerprint. */
export async function authenticateFingerprint<T>(base: string): Promise<T> {
  const optionsJSON = await api<Parameters<typeof startAuthentication>[0]['optionsJSON']>(`${base}/options`, { method: 'POST' })
  let response
  try {
    response = await startAuthentication({ optionsJSON })
  } catch (err) {
    throw friendlyError(err, false)
  }
  return api<T>(`${base}/verify`, { method: 'POST', body: { response } })
}
