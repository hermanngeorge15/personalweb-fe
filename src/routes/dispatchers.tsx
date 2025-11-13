import AppShell from '@/components/AppShell'

function DispatchersPage() {
  return (
    <AppShell path="Dispatchers">
      <div style={{ width: '100%', height: 'calc(100vh - 100px)' }}>
        <iframe
          src="/dispatchers.html"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '8px',
          }}
          title="Kotlin Coroutines Dispatcher Visualizer"
        />
      </div>
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: DispatchersPage,
})

