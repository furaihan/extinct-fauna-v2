import { createFormHook } from '@tanstack/react-form'
import { fieldContext, formContext } from './context.ts'
import { TextField, TextareaField } from './fields.tsx'

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    TextareaField,
  },
  formComponents: {},
  fieldContext,
  formContext,
})
