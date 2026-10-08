import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useCallback, type PropsWithChildren } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { api } from '@/lib/api'
import { RECAPTCHA_ACTIONS, RECAPTCHA_ENABLED } from '@/lib/recaptcha'
import { AlertIcon, CheckIcon, SpinnerIcon } from '@/components/icons'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormValues = z.infer<typeof schema>

export function ContactForm() {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const { executeRecaptcha } = useGoogleReCaptcha()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({ resolver: zodResolver(schema) })

  const onSubmit = useCallback(
    async (data: ContactFormValues) => {
      setSubmitError(null)
      setSubmitSuccess(false)

      try {
        // Get reCAPTCHA token
        let recaptchaToken: string | undefined

        if (RECAPTCHA_ENABLED && executeRecaptcha) {
          recaptchaToken = await executeRecaptcha(
            RECAPTCHA_ACTIONS.CONTACT_FORM,
          )
        }

        // Submit form with CAPTCHA token
        await api('/api/contact', {
          method: 'POST',
          body: JSON.stringify({
            ...data,
            website: '', // Honeypot field
            recaptchaToken,
          }),
        })

        // Success
        setSubmitSuccess(true)
        reset()

        // Clear success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000)
      } catch (error) {
        console.error('Form submission error:', error)
        setSubmitError(
          error instanceof Error
            ? error.message
            : 'Failed to submit form. Please try again.',
        )
      }
    },
    [executeRecaptcha, reset],
  )

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-[18px]"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Name Field */}
        <Field id="name" label="Name" error={errors.name?.message}>
          <input
            {...register('name')}
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={inputClass(Boolean(errors.name))}
          />
        </Field>

        {/* Email Field */}
        <Field id="email" label="Email" error={errors.email?.message}>
          <input
            {...register('email')}
            id="email"
            type="email"
            autoComplete="email"
            placeholder="your.email@example.com"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={inputClass(Boolean(errors.email))}
          />
        </Field>
      </div>

      {/* Message Field */}
      <Field id="message" label="Message" error={errors.message?.message}>
        <textarea
          {...register('message')}
          id="message"
          rows={7}
          placeholder="Tell me about your project or inquiry..."
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={`${inputClass(Boolean(errors.message))} resize-y leading-relaxed`}
        />
      </Field>

      {/* Error message */}
      {submitError && (
        <div
          role="alert"
          className="border-danger/40 bg-danger/10 flex items-start gap-3 rounded-xl border p-4"
        >
          <AlertIcon size={20} className="text-danger mt-0.5 shrink-0" />
          <div className="flex-1">
            <h3 className="text-heading text-sm font-semibold">Error</h3>
            <p className="text-body mt-1 text-sm">{submitError}</p>
          </div>
        </div>
      )}

      {/* Success message */}
      {submitSuccess && (
        <div
          role="status"
          className="border-brand-b/40 bg-brand-b/10 flex items-start gap-3 rounded-xl border p-4"
        >
          <CheckIcon size={20} className="text-brand-b mt-0.5 shrink-0" />
          <div className="flex-1">
            <h3 className="text-heading text-sm font-semibold">Success!</h3>
            <p className="text-body mt-1 text-sm">
              Message sent successfully! I&apos;ll get back to you soon.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* reCAPTCHA badge notice */}
        {RECAPTCHA_ENABLED && (
          <p className="text-faint max-w-[360px] flex-[1_1_240px] text-[13px] leading-normal">
            This site is protected by reCAPTCHA and the Google{' '}
            <a
              href="https://policies.google.com/privacy"
              className="hover:text-ink underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>{' '}
            and{' '}
            <a
              href="https://policies.google.com/terms"
              className="hover:text-ink underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>{' '}
            apply.
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand-gradient-x text-on-brand ml-auto inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[10px] px-[22px] text-[15px] font-medium transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <SpinnerIcon
                size={18}
                className="animate-spin motion-reduce:animate-none"
              />
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </button>
      </div>
    </form>
  )
}

function inputClass(invalid: boolean) {
  return `bg-subtle text-ink placeholder:text-fainter min-h-11 w-full rounded-[10px] border px-3.5 py-3 text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 ${
    invalid
      ? 'border-danger focus-visible:ring-danger/40'
      : 'border-line-strong focus:border-brand-a focus-visible:ring-brand-a/30'
  }`
}

function Field({
  id,
  label,
  error,
  children,
}: PropsWithChildren<{ id: string; label: string; error?: string }>) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-heading text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-danger text-sm">
          {error}
        </p>
      )}
    </div>
  )
}
