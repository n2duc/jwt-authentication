import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axiosInstance from "../lib/authorizedAxios"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

import {
  CardContent,
  CardFooter
} from "../components/ui/card"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form"

import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import CardLayout from "../layouts/CardLayout"

const formSchema = z.object({
  username: z.string().min(5, { message: "Username must be at least 3 characters long." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(5, { message: "Password must be at least 8 characters long." }),
})

const Register = () => {
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    }
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { username, email, password } = data
    const res = await axiosInstance.post(`/auth/register`, { username, email, password })
    toast.success(res.data?.message)
    navigate("/login")
  }

  return (
    <CardLayout title="Register" description="Enter your information below to register.">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn@ui.dev" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Register</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-zinc-900 font-medium hover:underline">Login</Link>
        </p>
      </CardFooter>
    </CardLayout>
  )
}

export default Register