import { ensureKeycloakAuth } from '@/lib/keycloak'
import AppShell from '@/components/AppShell'

export const Route = createFileRoute({
  beforeLoad: async () => {
    await ensureKeycloakAuth()
    return null
  },
  component: () => (
    <AppShell path="Admin">
      <div className="grid gap-4">
        <ul className="list-disc pl-6">
          <li>
            <a className="underline" href="/admin/posts">
              Posts
            </a>
          </li>
          <li>
            <a className="underline" href="/admin/projects">
              Projects
            </a>
          </li>
          <li>
            <a className="underline" href="/admin/testimonials">
              Testimonials
            </a>
          </li>
          <li>
            <a className="underline" href="/admin/resume/projects">
              Resume: Projects
            </a>
          </li>
          <li>
            <a className="underline" href="/admin/resume/education">
              Resume: Education
            </a>
          </li>
          <li>
            <a className="underline" href="/admin/resume/certificates">
              Resume: Certificates
            </a>
          </li>
          <li>
            <a className="underline" href="/admin/resume/languages">
              Resume: Languages
            </a>
          </li>
          <li>
            <a className="underline" href="/admin/resume/hobbies">
              Resume: Hobbies
            </a>
          </li>
        </ul>
      </div>
    </AppShell>
  ),
})
