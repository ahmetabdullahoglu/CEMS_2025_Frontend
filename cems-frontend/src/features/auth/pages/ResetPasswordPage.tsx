import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { useAuth } from '@/contexts/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { handleApiError } from '@/lib/api/client'

const schema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    new_password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string().min(8, 'Please confirm your password'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

type ResetPasswordValues = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tokenFromUrl = useMemo(() => searchParams.get('token') || '', [searchParams])

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      token: tokenFromUrl,
      new_password: '',
      confirm_password: '',
    },
  })

  const onSubmit = async (values: ResetPasswordValues) => {
    try {
      setError('')
      setSuccessMessage('')
      setIsSubmitting(true)
      await resetPassword({ token: values.token, new_password: values.new_password })
      setSuccessMessage('Your password has been updated. You can now login with the new password.')
      form.reset({ token: values.token, new_password: '', confirm_password: '' })
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cems-blue to-cems-blue-dark p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Set a new password</CardTitle>
          <CardDescription>Paste the token you received via email and set a new password</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reset Token</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Paste your token" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter new password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm new password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">{error}</div>
              )}

              {successMessage && (
                <div className="p-3 text-sm text-emerald-600 bg-emerald-600/10 rounded-md">{successMessage}</div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Update password'}
              </Button>

              <div className="text-sm text-center text-muted-foreground">
                <Link to="/login" className="text-primary underline-offset-2 hover:underline">
                  Back to login
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
