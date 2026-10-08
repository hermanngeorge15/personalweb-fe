import AppShell from '@/components/AppShell'

/** Placeholder so /projects resolves; the Projects redesign replaces this page. */
function ProjectsPage() {
  return (
    <AppShell path="Projects" fullBleed>
      <section className="mx-auto max-w-[1200px] px-4 py-24 sm:px-8">
        <h1 className="text-heading text-4xl font-semibold tracking-tight">
          Projects
        </h1>
      </section>
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: ProjectsPage,
})
