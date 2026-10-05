import { Eye, EyeOff } from 'lucide-react'
import { useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'

// Form controls from the style guide (/styleguide/inputs).

const controlClasses = (error?: string) =>
  `w-full px-3.5 py-2.5 text-sm rounded-xl border bg-bg text-text-base placeholder:text-text-muted outline-none
   transition-theme focus:ring-2 focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed
   ${error ? 'border-red-400 focus:ring-red-100 dark:focus:ring-red-950' : 'border-border focus:ring-primary/10'}`

interface FieldShellProps {
  id: string
  label: ReactNode
  required?: boolean
  hint?: ReactNode
  error?: string
  children: ReactNode
}

function FieldShell({ id, label, required, hint, error, children }: FieldShellProps) {
  return (
    <div className="space-y-1.5 min-w-0">
      <label htmlFor={id} className="block text-sm font-medium text-text-base">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : hint && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
  )
}

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  label: ReactNode
  hint?: ReactNode
  error?: string
  onChange: (value: string) => void
  /** Element shown inside the input on the right (e.g. an icon button). */
  after?: ReactNode
}

export function TextField({ label, hint, error, onChange, after, required, id, className = '', ...rest }: InputProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <FieldShell id={inputId} label={label} required={required} hint={hint} error={error}>
      <div className="relative">
        <input
          {...rest}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          onChange={(e) => onChange(e.target.value)}
          className={`${controlClasses(error)} ${after ? 'pr-10' : ''} ${className}`}
        />
        {after && <div className="absolute right-3 top-1/2 -translate-y-1/2 flex">{after}</div>}
      </div>
    </FieldShell>
  )
}

export function PasswordField(props: Omit<InputProps, 'type' | 'after'>) {
  const [visible, setVisible] = useState(false)
  return (
    <TextField
      {...props}
      type={visible ? 'text' : 'password'}
      after={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="text-text-muted hover:text-text-base transition-theme"
          aria-label={visible ? 'Esconder password' : 'Mostrar password'}
          title={visible ? 'Esconder password' : 'Mostrar password'}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
    />
  )
}

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
  label: ReactNode
  hint?: ReactNode
  error?: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

export function SelectField({ label, hint, error, options, onChange, required, id, ...rest }: SelectProps) {
  const autoId = useId()
  const selectId = id ?? autoId
  return (
    <FieldShell id={selectId} label={label} required={required} hint={hint} error={error}>
      <select
        {...rest}
        id={selectId}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className={`${controlClasses(error)} cursor-pointer`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

export function Checkbox({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: ReactNode
  description?: ReactNode
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <label className={`flex items-start gap-2.5 ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        aria-hidden
        className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-colors flex-shrink-0
          peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30
          ${checked ? 'border-primary bg-primary' : 'border-border bg-bg'}`}
      >
        {checked && (
          <svg viewBox="0 0 12 10" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="1,5 4,9 11,1" />
          </svg>
        )}
      </span>
      <span>
        <span className="block text-sm text-text-base">{label}</span>
        {description && <span className="block text-xs text-text-muted mt-0.5">{description}</span>}
      </span>
    </label>
  )
}

/** Immediate on/off setting (style guide "Toggle / Switch"). */
export function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: ReactNode
  description?: ReactNode
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-start justify-between gap-4 cursor-pointer">
      <span>
        <span className="block text-sm font-medium text-text-base">{label}</span>
        {description && <span className="block text-xs text-text-muted mt-0.5">{description}</span>}
      </span>
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span
        aria-hidden
        className={`relative mt-0.5 rounded-full transition-colors duration-200 flex-shrink-0 peer-focus-visible:ring-2
          peer-focus-visible:ring-primary/30 ${checked ? 'bg-primary' : 'bg-neutral/40'}`}
        style={{ width: 40, height: 22 }}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow transition-transform duration-200
            ${checked ? 'translate-x-[18px]' : 'translate-x-0'}`}
        />
      </span>
    </label>
  )
}

/** Exclusive choice shown as selectable pills (style guide user form "Estado"). */
export function ChoiceGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: ReactNode
  value: T
  options: { value: T; label: string; description?: string }[]
  onChange: (value: T) => void
}) {
  const name = useId()
  return (
    <fieldset className="space-y-1.5">
      <legend className="block text-sm font-medium text-text-base mb-1.5">{label}</legend>
      <div className="flex gap-2 flex-wrap">
        {options.map((o) => {
          const active = o.value === value
          return (
            <label
              key={o.value}
              title={o.description}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm cursor-pointer transition-theme
                has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/30
                ${active ? 'border-primary bg-primary/5 text-primary font-medium' : 'border-border text-text-muted hover:bg-surface-hover'}`}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={active}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              {o.label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
