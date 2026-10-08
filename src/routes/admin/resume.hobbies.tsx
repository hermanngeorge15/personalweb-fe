import { ensureKeycloakAuth } from '@/lib/keycloak'
import AdminShell from '@/components/admin/AdminShell'
import { FormActions } from '@/components/admin/AdminForm'
import { MutationStatus, clearSaved } from '@/components/admin/MutationStatus'
import {
  AdminCard,
  AdminPageHeader,
  Field,
  Notice,
  inputClass,
  primaryButton,
} from '@/components/admin/ui'
import { useResumeHobbies, useUpsertResumeHobbies } from '@/lib/queries'

function AdminResumeHobbies() {
  const { data, isPending, isError, isSuccess } = useResumeHobbies()
  const upsertHobbies = useUpsertResumeHobbies()
  return (
    <AdminShell
      crumbs={[
        { label: 'Admin', to: '/admin' },
        { label: 'Resume' },
        { label: 'Hobbies' },
      ]}
      viewHref="/resume"
    >
      <AdminPageHeader title="Resume Hobbies" />
      <div className="mt-6 max-w-[720px]">
        {isPending && <Notice>Loading…</Notice>}
        {isError && (
          <Notice tone="danger">Failed to load resume hobbies.</Notice>
        )}
        {/* Uncontrolled inputs read defaultValue once, so the form mounts only after a
            successful load (data may be null: no record yet). Mounting it earlier — or while
            retries are paused, when isLoading is already false — would save [] over the
            stored hobbies. */}
        {isSuccess && (
          <AdminCard>
            <form
              key={data?.id ?? 'new'}
              onChange={() => clearSaved(upsertHobbies)}
              className="grid gap-5"
              onSubmit={async (e) => {
                e.preventDefault()
                const fd = new FormData(e.currentTarget as HTMLFormElement)
                const sports = String(fd.get('sports') ?? '')
                const others = String(fd.get('others') ?? '')
                await upsertHobbies
                  .mutateAsync({
                    sports: sports
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                    others: others
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                  .catch(() => undefined) // shown by MutationStatus
              }}
            >
              <Field label="Sports" hint="Comma-separated">
                <input
                  name="sports"
                  className={inputClass}
                  defaultValue={(data?.sports ?? []).join(', ')}
                />
              </Field>
              <Field label="Others" hint="Comma-separated">
                <input
                  name="others"
                  className={inputClass}
                  defaultValue={(data?.others ?? []).join(', ')}
                />
              </Field>
              <FormActions>
                <button
                  type="submit"
                  className={primaryButton}
                  disabled={upsertHobbies.isPending}
                >
                  {upsertHobbies.isPending ? 'Saving…' : 'Save'}
                </button>
                <MutationStatus
                  isSuccess={upsertHobbies.isSuccess}
                  error={upsertHobbies.error}
                />
              </FormActions>
            </form>
          </AdminCard>
        )}
      </div>
    </AdminShell>
  )
}

export const Route = createFileRoute({
  beforeLoad: async () => {
    await ensureKeycloakAuth()
    return null
  },
  component: AdminResumeHobbies,
})
