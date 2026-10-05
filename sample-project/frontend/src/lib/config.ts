import { useEffect, useState } from 'react'
import { api } from './api'

export interface AppConfig {
  /** Dev-only Mailpit inbox URL; null when not configured (e.g. production). */
  mailpitUrl: string | null
}

let cached: Promise<AppConfig> | null = null

const loadConfig = () => (cached ??= api<AppConfig>('/config').catch(() => ({ mailpitUrl: null })))

/** Runtime config from GET /api/config, fetched once per page load. */
export function useAppConfig(): AppConfig {
  const [config, setConfig] = useState<AppConfig>({ mailpitUrl: null })
  useEffect(() => {
    let alive = true
    loadConfig().then((c) => alive && setConfig(c))
    return () => {
      alive = false
    }
  }, [])
  return config
}
