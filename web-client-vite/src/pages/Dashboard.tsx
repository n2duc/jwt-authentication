import { useEffect, useState } from "react"
import { LogOut, RocketIcon } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/authorizedAxios"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "../components/ui/card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../components/ui/alert"
import { Button } from "../components/ui/button"
import { handleLogoutAPI } from "../apis";
import LoadingSpin from "../components/LoadingSpin";
import TasksList from "../components/TasksList";

type User = {
  email: string
  id: string
  username: string
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch user data
    const fetchData = async () => {
      const res = await axiosInstance.get(`/dashboards/access`)
      setUser(res.data)
    }
    fetchData()
  }, [])

  const handleLogout = async () => {
    
    await handleLogoutAPI()
    // Điều huống về trang Login khi Logout
    navigate("/login")
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpin />
      </div>
    )
  }

  return (
    <div className="p-5 w-full flex flex-col md:flex-row gap-4">
      <div className="w-full flex-[2]">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Dashboard Page</CardTitle>
            <CardDescription>Bạn đã đăng nhập thành công.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-green-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.username}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </CardFooter>
        </Card>
        <Alert className="w-full mt-3">
          <RocketIcon className="h-4 w-4" />
          <AlertTitle>Bạn đã đăng nhập thành công!</AlertTitle>
          <AlertDescription>
            Your email: <span className="text-emerald-500 font-medium">{user?.email}</span>
          </AlertDescription>
        </Alert>
      </div>
      <TasksList className="w-full flex-1"/>
    </div>
  )
}

export default Dashboard