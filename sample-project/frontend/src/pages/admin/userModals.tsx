import { Mail, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, ApiError, errorMessage } from '../../lib/api'
import type { User } from '../../lib/auth'
import { Button } from '../../ui/Button'
import { Alert } from '../../ui/feedback'
import { Checkbox } from '../../ui/form'
import { Modal } from '../../ui/layout'

export function WelcomeModal({ user, onClose, onSent }: { user: User; onClose: () => void; onSent: (message: string) => void }) {
  const [includeReset, setIncludeReset] = useState(true)
  const [error, setError] = useState<{ message: string; needsSettings: boolean } | null>(null)
  const [busy, setBusy] = useState(false)

  async function send() {
    setError(null)
    setBusy(true)
    try {
      const { message } = await api<{ message: string }>(`/users/${user.id}/welcome`, { method: 'POST', body: { includeReset } })
      onSent(message)
    } catch (err) {
      // 409 = e-mail sending is not configured yet
      setError({ message: errorMessage(err), needsSettings: err instanceof ApiError && err.status === 409 })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal
      title="E-mail de boas-vindas"
      onClose={onClose}
      footer={
        <>
          <Button variant="subtle" onClick={onClose}>Cancelar</Button>
          <Button onClick={send} loading={busy} icon={<Mail size={15} />}>Enviar</Button>
        </>
      }
    >
      {error && (
        <Alert>
          {error.message}{' '}
          {error.needsSettings && (
            <Link to="/admin/settings/email" className="font-semibold underline">Configurar agora</Link>
          )}
        </Alert>
      )}
      <p className="text-sm text-text-muted">
        Vamos enviar a <strong className="text-text-base">{user.email}</strong> um e-mail a indicar que pertence à plataforma.
      </p>
      <Checkbox
        label="Incluir link para definir a password"
        description="O link é válido durante 72 horas e só pode ser usado uma vez."
        checked={includeReset}
        onChange={setIncludeReset}
      />
    </Modal>
  )
}

export function DeleteUserModal({ user, onClose, onDeleted }: { user: User; onClose: () => void; onDeleted: () => void }) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function remove() {
    setError('')
    setBusy(true)
    try {
      await api(`/users/${user.id}`, { method: 'DELETE' })
      onDeleted()
    } catch (err) {
      setError(errorMessage(err))
      setBusy(false)
    }
  }

  return (
    <Modal
      title="Eliminar utilizador"
      onClose={onClose}
      footer={
        <>
          <Button variant="subtle" onClick={onClose}>Cancelar</Button>
          <Button variant="destructive" onClick={remove} loading={busy} icon={<Trash2 size={15} />}>Eliminar</Button>
        </>
      }
    >
      <Alert>{error}</Alert>
      <p className="text-sm text-text-muted">
        Tens a certeza que pretendes eliminar <strong className="text-text-base">{user.name || user.email}</strong>? Esta ação é{' '}
        <strong className="text-text-base">permanente e irreversível</strong>.
      </p>
    </Modal>
  )
}
