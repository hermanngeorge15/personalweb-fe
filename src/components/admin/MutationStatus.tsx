interface MutationStatusProps {
  isSuccess: boolean
  error: unknown
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
