import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Textarea, Button } from '@heroui/react'
import { api } from '@/lib/api'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
})

type ContactFormValues = z.infer<typeof schema>

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({ resolver: zodResolver(schema) })

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        await api('/contact', {
          method: 'POST',
          body: JSON.stringify({ ...data, website: '' }),
        })
        reset()
      })}
      className="grid max-w-xl gap-4"
    >
      <Input
        label="Name"
        {...register('name')}
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
      />
      <Input
        label="Email"
        type="email"
        {...register('email')}
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
      />
      <Textarea
        label="Message"
        minRows={5}
        {...register('message')}
        isInvalid={!!errors.message}
        errorMessage={errors.message?.message}
      />
      <Button type="submit" isDisabled={isSubmitting} color="primary">
        Send
      </Button>
    </form>
  )
}
