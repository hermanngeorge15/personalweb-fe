import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Textarea, Button } from '@heroui/react'
import { useState, useCallback } from 'react'
import { api } from '@/lib/api'
import {
  executeRecaptcha,
  RECAPTCHA_ACTIONS,
  RECAPTCHA_ENABLED,
} from '@/lib/recaptcha'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormValues = z.infer<typeof schema>

export function ContactForm() {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

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
        const recaptchaToken = await executeRecaptcha(
          RECAPTCHA_ACTIONS.CONTACT_FORM,
        )

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
    [reset],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-xl gap-4">
      <Input
        label="Name"
        labelPlacement="outside"
        placeholder="Enter your name"
        {...register('name')}
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
      />
      <Input
        label="Email"
        type="email"
        labelPlacement="outside"
        placeholder="Enter your email"
        {...register('email')}
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
      />
      <Textarea
        label="Message"
        labelPlacement="outside"
        placeholder="Enter your message"
        minRows={5}
        {...register('message')}
        isInvalid={!!errors.message}
        errorMessage={errors.message?.message}
      />

      {/* Error message */}
      {submitError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {submitError}
        </div>
      )}

      {/* Success message */}
      {submitSuccess && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
          Message sent successfully! We&apos;ll get back to you soon.
        </div>
      )}

      <Button
        type="submit"
        isDisabled={isSubmitting}
        color="primary"
        isLoading={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send'}
      </Button>

      {/* reCAPTCHA badge notice */}
      {RECAPTCHA_ENABLED && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          This site is protected by reCAPTCHA and the Google{' '}
          <a
            href="https://policies.google.com/privacy"
            className="underline hover:text-gray-700 dark:hover:text-gray-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            href="https://policies.google.com/terms"
            className="underline hover:text-gray-700 dark:hover:text-gray-300"
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
