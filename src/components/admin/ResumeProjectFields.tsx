import type { ResumeProject } from '@/lib/queries'
// Shown in local time, because the save reads the input as local time.
import { toDateTimeInput } from '@/lib/adminFormat'
import { cx, Field, inputClass, textareaClass } from './ui'

/**
 * The inputs of a resume project (create and edit forms). Uncontrolled: each form reads them
 * with FormData by `name`, so the names are part of the save logic.
 */
export function ResumeProjectFields({ project }: { project?: ResumeProject }) {
  return (
    <div className="@container grid gap-4">
      <div className="grid gap-4 @md:grid-cols-2">
        <Field label="Company">
          <input
            name="company"
            defaultValue={project?.company}
            className={inputClass}
          />
        </Field>
        <Field label="Project name">
          <input
            name="projectName"
            defaultValue={project?.projectName}
            className={inputClass}
          />
        </Field>
        <Field label="From">
          <input
            name="from"
            type="datetime-local"
            defaultValue={
              project?.startAt ? toDateTimeInput(project.startAt) : undefined
            }
            className={inputClass}
            required
          />
        </Field>
        <Field label="Until" hint="Empty = present">
          <input
            name="until"
            type="datetime-local"
            defaultValue={
              project?.endAt ? toDateTimeInput(project.endAt) : undefined
            }
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Description">
        <textarea
          name="description"
          defaultValue={project?.description}
          rows={4}
          className={cx(textareaClass, 'min-h-[120px]')}
        />
      </Field>
      <Field label="Responsibilities" hint="Comma-separated">
        <input
          name="responsibilities"
          defaultValue={
            project ? (project.responsibilities ?? []).join(', ') : undefined
          }
          className={inputClass}
        />
      </Field>
      <Field label="Tech stack" hint="Comma-separated">
        <input
          name="techStack"
          defaultValue={
            project ? (project.techStack ?? []).join(', ') : undefined
          }
          className={inputClass}
        />
      </Field>
      <div className="grid gap-4 @md:grid-cols-2">
        <Field label="Repo URL">
          <input
            name="repoUrl"
            defaultValue={project?.repoUrl}
            className={inputClass}
          />
        </Field>
        <Field label="Demo URL">
          <input
            name="demoUrl"
            defaultValue={project?.demoUrl}
            className={inputClass}
          />
        </Field>
      </div>
    </div>
  )
}
