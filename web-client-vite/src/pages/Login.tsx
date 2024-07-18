import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"

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
import { handleLoginAPI } from "../apis"
import CardLayout from "../layouts/CardLayout"
import { PasswordInput } from "../components/ui/password-input"

const formSchema = z.object({
  username: z.string().min(5, { message: "Username must be at least 3 characters long." }),
  password: z.string().min(5, { message: "Password must be at least 8 characters long." }),
})

const Login = () => {
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { username, password } = data
    const res = await handleLoginAPI(username, password)
    const userInfo = { id: res.id, isAdmin: res.isAdmin }

    localStorage.setItem("userInfo", JSON.stringify(userInfo))

    // Điều hướng tới trang Dashboard thì Login thành công
    navigate("/")
  }

  return (
    <CardLayout title="Login" description="Enter your username and password below to enter the dashboard.">
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Enter password" {...field} />
                  </FormControl>
                  <Link to="/forgot-password" className="block text-end text-xs underline text-slate-800">Forgot Password?</Link>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm text-gray-500">
          Don't have an account? <Link to="/register" className="text-zinc-900 font-medium hover:underline">Register</Link>
        </p>
      </CardFooter>
    </CardLayout>
  )
}

export default Login