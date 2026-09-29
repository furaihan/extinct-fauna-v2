import type { ChangeEvent } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/shared/ui/field.tsx'
import { Input } from '@/shared/ui/input.tsx'
import { useFieldContext } from './context.ts'

function toFieldErrors(errors: unknown): Array<{ message?: string }> {
  if (!Array.isArray(errors)) return []
  return errors.map((e) =>
    typeof e === 'string' ? { message: e } : (e as { message?: string }),
  )
}

interface TextFieldProps {
  label: string
  id: string
  placeholder?: string
  maxLength?: number
  inputMode?: 'text' | 'url'
  type?: 'text' | 'email' | 'password' | 'tel'
  autoComplete?: string
  description?: string
  readOnly?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export function TextField({ label, id, placeholder, maxLength, inputMode, type, autoComplete, description, readOnly, onChange }: TextFieldProps) {
  const field = useFieldContext<string>()
  const invalid = field.state.meta.isTouched && !field.state.meta.isValid
  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        placeholder={placeholder}
        readOnly={readOnly}
        value={field.state.value}
        onChange={(e) => {
          if (onChange) onChange(e)
          else field.handleChange(e.target.value)
        }}
        onBlur={field.handleBlur}
        aria-invalid={invalid}
        className="min-h-[44px]"
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={toFieldErrors(field.state.meta.errors)} />
    </Field>
  )
}

interface TextareaFieldProps {
  label: string
  id: string
  placeholder?: string
  maxLength?: number
  rows?: number
  showCount?: boolean
  description?: string
}

export function TextareaField({ label, id, placeholder, maxLength, rows = 3, showCount, description }: TextareaFieldProps) {
  const field = useFieldContext<string>()
  const invalid = field.state.meta.isTouched && !field.state.meta.isValid
  return (
    <Field data-invalid={invalid}>
      <div className="flex items-baseline justify-between gap-2">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {showCount && maxLength != null && (
          <span className="text-xs text-neutral-400">
            {field.state.value.length}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        id={id}
        maxLength={maxLength}
        rows={rows}
        placeholder={placeholder}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={invalid}
        className="min-h-[76px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={toFieldErrors(field.state.meta.errors)} />
    </Field>
  )
}
