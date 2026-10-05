import { ButtonLink } from '../ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-3 p-4 text-center bg-bg">
      <p className="text-5xl font-bold text-primary">404</p>
      <h1 className="text-xl font-semibold text-text-base">Página não encontrada</h1>
      <p className="text-sm text-text-muted">O endereço que procuras não existe ou foi movido.</p>
      <ButtonLink to="/" variant="subtle">
        Voltar ao início
      </ButtonLink>
    </div>
  )
}
