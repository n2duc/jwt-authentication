import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Link } from "react-router-dom"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form"

import {
  Alert,
  AlertDescription
} from "../components/ui/alert"

import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { CircleAlert, MailCheck, MoveLeft } from "lucide-react"
import { forgotPassword } from "../apis"
import { useState } from "react"
import toast from "react-hot-toast"
import CardLayout from "../layouts/CardLayout"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
})

const ForgotPassword = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [successDate, setSuccessData] = useState({ success: false, message: "" })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    }
  })

  const submitEmail = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const res = await forgotPassword(data.email)
      if (res.success) {
        form.reset()
        toast.success('Email sent! Please check your inbox.')
        setLoading(false)
        setSuccessData(res)
      }
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <>
      {successDate.success ? (
        <Card className="max-w-md w-full px-6 py-4">
          <CardHeader className="flex flex-col items-center">
            <MailCheck className="h-8 w-8 text-blue-500 bg-blue-100 box-content p-3 rounded-full border-2 border-blue-50" />
            <CardTitle className="text-base text-slate-900 font-semibold">Email has been sent!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-center text-gray-700">{successDate.message}</p>
          </CardContent>
          <CardFooter className="flex flex-col items-center">
            <Button onClick={() => setSuccessData({ success: false, message: "" })} className="w-full">Back</Button>
            <p className="text-xs mt-4">Did not receive the email? Check your spam filter</p>
          </CardFooter>
        </Card>
      ) : (
        <CardLayout title="Forgot Password?" description="No worries, we'll send you reset instructions.">
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submitEmail)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter your email</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn@ui.dev" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Alert variant="warning">
                  <CircleAlert className="h-4 w-4" />
                  <AlertDescription>
                    We can't seem to find the right email address for you, resend the email that you have registered
                  </AlertDescription>
                </Alert>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-t-2 border-r-2 border-blue-500 rounded-full animate-spin" />
                      <span className="ml-2">Loading...</span>
                    </>
                  ) : 'Reset Password'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Link to="/login" className="border border-slate-300 w-full text-center py-2 rounded-sm text-sm font-medium flex items-center justify-center gap-2">
              <MoveLeft size={20} />
              Back to login
            </Link>
            <p className="text-center text-sm text-gray-500">
              Don't have an account? <Link to="/register" className="text-zinc-900 font-medium hover:underline">Register</Link>
            </p>
          </CardFooter>
        </CardLayout>
      )}
    </>
  )
}

export default ForgotPassword