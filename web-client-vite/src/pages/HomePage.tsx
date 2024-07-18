import { useContext } from "react"
import { LogOut, RocketIcon } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";

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
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { handleLogoutAPI } from "../apis";
import LoadingSpin from "../components/LoadingSpin";
import TasksList from "../components/TasksList";
import UpdateProfile from "../components/UpdateProfile";
import { Skeleton } from "../components/ui/skeleton";
import { AuthContext } from "../contexts/AuthContext";
import { AuthType } from "../types";

const HomePage = () => {
  const { auth } = useContext(AuthContext) as { auth: AuthType }
  const navigate = useNavigate()

  const handleLogout = async () => {
    await handleLogoutAPI()
    navigate("/login")
  }

  if (!auth) {
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
          <CardHeader className="flex-row justify-between">
            <div className="flex flex-col items-start gap-2">
              <CardTitle>Home Page</CardTitle>
              <CardDescription>Bạn đã đăng nhập thành công.</CardDescription>
            </div>
            <Avatar>
              <AvatarImage src={auth?.avatar.url} />
              <AvatarFallback>
                <Skeleton className="h-full w-full" />
              </AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-green-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {auth?.username}
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
            Your email: <span className="text-emerald-500 font-medium">{auth?.email}</span>
          </AlertDescription>
          <UpdateProfile dataUser={auth} />
        </Alert>
        {auth.isAdmin && (
          <Alert className="w-full mt-3">
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>Bạn là Admin!</AlertTitle>
            <AlertDescription>
              Bạn có thể thực hiện các thao tác quản trị viên.
            </AlertDescription>
            <Button className="mt-3">
              <Link to="/dashboard" className="text-emerald-500 font-medium">Truy cập trang quản trị viên</Link>
            </Button>
          </Alert>
        )}
      </div>
      <TasksList className="w-full flex-1"/>
    </div>
  )
}

export default HomePage