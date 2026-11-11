'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Archive, ArrowDown, ArrowUp, Plus, RotateCcw } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { PageHeader } from '~/components/ui/page-header'
import { PageIntro } from '~/components/ui/page-intro'
import { Spinner } from '~/components/ui/spinner'
import { useDisclosure } from '~/hooks/useDisclosure'
import { useActiveTenant } from '../../layout/use-active-tenant'
import {
  useRecurringIncomeConfigurationQuery,
  useUpdateRecurringIncomeConfigurationMutation,
} from '../tenants.queries'
import { incomeSetupFormSchema, type IncomeSetupFormValues } from './income-setup.schema'
import { IncomeFieldSheet } from './income-field-sheet'

export function IncomeSetupPage() {
  const access = useActiveTenant()
  const canManage = access.role === 'admin' || access.role === 'superadmin'
  if (!canManage) {
    return <div className="mx-auto max-w-xl p-6 text-sm text-text-secondary">Only administrators can manage recurring income.</div>
  }
  return <TenantIncomeSetup key={access.tenant.id} tenantId={access.tenant.id} />
}

function TenantIncomeSetup({ tenantId }: { tenantId: string }) {
  const configuration = useRecurringIncomeConfigurationQuery(tenantId)
  const updateConfiguration = useUpdateRecurringIncomeConfigurationMutation(tenantId)
  const form = useForm<IncomeSetupFormValues>({
    resolver: zodResolver(incomeSetupFormSchema),
    defaultValues: { fields: [] },
    mode: 'onChange',
  })
  const fields = useFieldArray({ control: form.control, name: 'fields', keyName: 'fieldKey' })
  const addField = useDisclosure()
  const revisionRef = useRef(0)
  const savingRef = useRef(false)

  useEffect(() => {
    if (!configuration.data) return
    revisionRef.current = configuration.data.revision
    form.reset({ fields: configuration.data.fields.map((field) => ({ ...field })) })
  }, [configuration.data, form])

  if (configuration.isPending) {
    return <div className="flex min-h-64 items-center justify-center"><Spinner className="size-6" /></div>
  }
  if (configuration.isError) {
    return <div className="mx-auto max-w-xl p-6"><p className="text-sm text-destructive">Unable to load recurring income.</p><Button className="mt-3" variant="outline" onClick={() => void configuration.refetch()}>Try again</Button></div>
  }

  const activeIndexes = fields.fields.flatMap((field, index) => field.active ? [index] : [])
  const archivedIndexes = fields.fields.flatMap((field, index) => field.active ? [] : [index])
  const persist = async (values: IncomeSetupFormValues, successMessage?: string) => {
    if (savingRef.current) return false
    const parsed = incomeSetupFormSchema.safeParse(values)
    if (!parsed.success) {
      await form.trigger()
      return false
    }
    savingRef.current = true
    try {
      const updated = await updateConfiguration.mutateAsync({
        expectedRevision: revisionRef.current,
        fields: parsed.data.fields,
      })
      revisionRef.current = updated.revision
      form.reset({ fields: updated.fields.map((field) => ({ ...field })) })
      if (successMessage) toast.success(successMessage)
      return true
    } catch {
      toast.error('Unable to save. Reload if another administrator changed these fields.')
      form.reset({ fields: configuration.data.fields.map((field) => ({ ...field })) })
      return false
    } finally {
      savingRef.current = false
    }
  }

  const moveField = (from: number, to: number) => {
    const next = [...form.getValues('fields')]
    const [moved] = next.splice(from, 1)
    if (!moved) return
    next.splice(to, 0, moved)
    void persist({ fields: next })
  }

  const setFieldActive = (index: number, active: boolean) => {
    const next = form.getValues('fields').map((field, fieldIndex) =>
      fieldIndex === index ? { ...field, active } : field,
    )
    void persist({ fields: next }, active ? 'Income field restored' : 'Income field archived')
  }

  const saveRenamedField = (index: number) => {
    const current = form.getValues('fields')
    const persisted = configuration.data.fields.find((field) => field.id === current[index]?.id)
    if (persisted?.description === current[index]?.description) return
    void persist({ fields: current }, 'Income field updated')
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-5 py-5 md:p-6">
      <PageHeader title="Recurring income" backHref="/me" backLabel="Back to Me" />
      <PageIntro>Configure fields that start at zero in new reports. Changes save immediately and do not affect existing reports.</PageIntro>

      <IncomeFieldSheet
        open={addField.open}
        existingDescriptions={form.getValues('fields').map((field) => field.description)}
        onAdd={(description) =>
          persist(
            {
              fields: [
                ...form.getValues('fields'),
                { id: null, description, active: true },
              ],
            },
            'Income field added',
          )
        }
        onClose={addField.onClose}
      />

      <div className="flex flex-col gap-5">
        <section aria-labelledby="active-income-heading" className="flex flex-col gap-3">
          <div>
            <h2 id="active-income-heading" className="font-medium text-text-heading">Active fields</h2>
            <p className="mt-1 text-sm text-text-secondary">Their order here is the order shown in new reports.</p>
          </div>
          {activeIndexes.length === 0 ? (
            <div className="rounded-md bg-card p-6 text-center text-sm text-text-secondary shadow-card">No recurring income fields configured.</div>
          ) : (
            <ul className="overflow-hidden rounded-md bg-card shadow-card">
              {activeIndexes.map((index, position) => {
                const field = fields.fields[index]
                return (
                  <li key={field.fieldKey} className="flex items-start gap-2 border-b border-border/60 p-3 last:border-b-0">
                    <div className="min-w-0 flex-1">
                      <Input aria-label={`Income field ${position + 1}`} maxLength={120} disabled={updateConfiguration.isPending} {...form.register(`fields.${index}.description`)} onBlur={() => saveRenamedField(index)} />
                      {form.formState.errors.fields?.[index]?.description?.message && <p className="mt-1 text-xs text-destructive">{form.formState.errors.fields[index]?.description?.message}</p>}
                    </div>
                    <Button type="button" size="icon" variant="ghost" aria-label={`Move ${field.description} up`} disabled={position === 0 || updateConfiguration.isPending} onClick={() => moveField(index, activeIndexes[position - 1])}><ArrowUp aria-hidden="true" /></Button>
                    <Button type="button" size="icon" variant="ghost" aria-label={`Move ${field.description} down`} disabled={position === activeIndexes.length - 1 || updateConfiguration.isPending} onClick={() => moveField(index, activeIndexes[position + 1])}><ArrowDown aria-hidden="true" /></Button>
                    <Button type="button" size="icon" variant="ghost" aria-label={`Archive ${field.description}`} disabled={updateConfiguration.isPending} onClick={() => setFieldActive(index, false)}><Archive aria-hidden="true" /></Button>
                  </li>
                )
              })}
            </ul>
          )}
          <Button type="button" variant="outline" disabled={updateConfiguration.isPending} onClick={addField.onOpen}><Plus aria-hidden="true" />Add field</Button>
        </section>

        {archivedIndexes.length > 0 && (
          <section aria-labelledby="archived-income-heading" className="flex flex-col gap-3">
            <div>
              <h2 id="archived-income-heading" className="font-medium text-text-heading">Archived fields</h2>
              <p className="mt-1 text-sm text-text-secondary">Archived fields stay available for historical reporting.</p>
            </div>
            <ul className="overflow-hidden rounded-md bg-card shadow-card">
              {archivedIndexes.map((index) => {
                const field = fields.fields[index]
                return <li key={field.fieldKey} className="flex min-h-14 items-center gap-3 border-b border-border/60 px-4 py-2 last:border-b-0"><span className="min-w-0 flex-1 truncate text-text-secondary">{field.description}</span><Button type="button" variant="ghost" disabled={updateConfiguration.isPending} onClick={() => setFieldActive(index, true)}><RotateCcw aria-hidden="true" />Restore</Button></li>
              })}
            </ul>
          </section>
        )}

      </div>
    </div>
  )
}
