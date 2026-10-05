interface MutationStatusProps {
  isSuccess: boolean
  error: unknown
}

/**
 * Clears "Saved." once a field changes after a save, so it never describes unsaved edits.
 * Use as the form's onChange. Errors stay until the next submit.
 */
export function clearSaved(mutation: {
  isSuccess: boolean
  reset: () => void
}) {
  if (mutation.isSuccess) mutation.reset()
}

/**
 * "Saved." or the server's error for a hand-written admin form, the same messages AdminForm
 * shows. Pass the mutation's own state, and catch the rejection of mutateAsync so the error is
 * shown here rather than lost as an unhandled promise rejection.
 */
export function MutationStatus({ isSuccess, error }: MutationStatusProps) {
  if (error) {
    return (
      <span role="alert" className="text-sm text-red-600">
        Not saved: {error instanceof Error ? error.message : String(error)}
      </span>
    )
  }
  if (isSuccess) return <span className="text-sm text-green-700">Saved.</span>
  return null
}
