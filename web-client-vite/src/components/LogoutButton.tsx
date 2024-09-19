import { LogOut } from "lucide-react"
import { Button } from './ui/button'
import { useNavigate } from "react-router-dom"
import { handleLogoutAPI } from "../apis"

const LogoutButton = ({ className }: { className?: string }) => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await handleLogoutAPI()
    navigate("/login")
  }

  return (
    <Button onClick={handleLogout} className={className}>
      <LogOut className="mr-2 h-4 w-4" /> Logout
    </Button>
  )
}

export default LogoutButton