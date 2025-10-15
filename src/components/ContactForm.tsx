import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useCallback } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { api } from '@/lib/api'
import { RECAPTCHA_ACTIONS, RECAPTCHA_ENABLED } from '@/lib/recaptcha'

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-gray-900"
        >
          Name
        </label>
        <input
          {...register('name')}
          id="name"
          type="text"
          placeholder="Your full name"
          className={`w-full rounded-xl border px-4 py-3 text-base transition-colors ${
            errors.name
              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-500'
          } shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50`}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-900"
        >
          Email
        </label>
        <input
          {...register('email')}
          id="email"
          type="email"
          placeholder="your.email@example.com"
          className={`w-full rounded-xl border px-4 py-3 text-base transition-colors ${
            errors.email
              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-500'
          } shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50`}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label
          htmlFor="message"
          className="block text-sm font-semibold text-gray-900"
        >
          Message
        </label>
        <textarea
          {...register('message')}
          id="message"
          rows={6}
          placeholder="Tell me about your project or inquiry..."
          className={`w-full rounded-xl border px-4 py-3 text-base transition-colors ${
            errors.message
              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-500'
          } shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none`}
        />
        {errors.message && (
          <p className="text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      {/* Error message */}
      {submitError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <svg
            className="h-5 w-5 shrink-0 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-red-900">Error</h4>
            <p className="mt-1 text-sm text-red-700">{submitError}</p>
          </div>
        </div>
      )}

      {/* Success message */}
      {submitSuccess && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
          <svg
            className="h-5 w-5 shrink-0 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-green-900">Success!</h4>
            <p className="mt-1 text-sm text-green-700">
              Message sent successfully! I&apos;ll get back to you soon.
            </p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-5 w-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Sending...
          </span>
        ) : (
          'Send Message'
        )}
      </button>

      {/* reCAPTCHA badge notice */}
      {RECAPTCHA_ENABLED && (
        <p className="text-center text-xs text-gray-500">
          This site is protected by reCAPTCHA and the Google{' '}
          <a
            href="https://policies.google.com/privacy"
            className="underline hover:text-gray-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            href="https://policies.google.com/terms"
            className="underline hover:text-gray-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>{' '}
          apply.
        </p>
      )}
    </form>
  )
}
