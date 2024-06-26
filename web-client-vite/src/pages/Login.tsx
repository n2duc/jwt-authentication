import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axiosInstance from "../lib/authorizedAxios"
import { Link, useNavigate } from "react-router-dom"

import {
  Card,
  CardContent,
  CardDescription,
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
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"

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
    const res = await axiosInstance.post(`/users/login`, { username, password })
    // console.log(res.data)
    const { id, email: userEmail, username: userName }  = res.data
    const userInfo = { id, userEmail, userName }

    // TH2: Trường hợp lưu accessToken vào localStorage và muốn thêm vào header của mỗi request
    // localStorage.setItem("accessToken", res.data.accessToken)
    // localStorage.setItem("refreshToken", res.data.refreshToken)

    localStorage.setItem("userInfo", JSON.stringify(userInfo))

    // Điều hướng tới trang Dashboard thì Login thành công
    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to enter the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-5">
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
                      <Input placeholder="Enter password" type="password" {...field} />
                    </FormControl>
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
            Don't have an account? <Link to="/register" className="text-blue-600">Register</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login