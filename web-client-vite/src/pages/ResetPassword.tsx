import { Link, useParams, useNavigate } from 'react-router-dom'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import CardLayout from '../layouts/CardLayout';
import { CardContent, CardFooter } from '../components/ui/card'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form"
import { Button } from '../components/ui/button'
import { PasswordInput } from '../components/ui/password-input'
import { resetPassword } from '../apis'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios';

const formSchema = z.object({
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters long." }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters long." }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"]
})

const ResetPassword = () => {
  const { userId, token } = useParams()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    }
  })

  const handleChangePassword = async (data: z.infer<typeof formSchema>) => {
    try {
      if (!userId || !token) return toast.error("Invalid token.")
      const response = await resetPassword(data.newPassword, userId, token)
      if (response.data.statusCode === 200) {
        toast.success(response.data.message)
        setTimeout(() => {
          navigate("/login")
        }, 1000)
      } else {
        toast.error(response.data.message)
      }
    } catch (error: unknown) {
      let errorMessage = 'An error occurred. Please try again later.'
      if (error instanceof AxiosError) {
        if (error?.response?.data?.message) {
          errorMessage = `${error.response.data.message}`;
        }
      }
      toast.error(errorMessage)
    }
  }

  return (
    <>
      <CardLayout title="Create new password" description="Your new password must be different from previous used passwords.">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleChangePassword)} className="space-y-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="New Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Confirm Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Reset Password</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full" asChild>
            <Link to="/login">Back To Login</Link>
          </Button>
        </CardFooter>
      </CardLayout>
    </>
  )
}

export default ResetPassword