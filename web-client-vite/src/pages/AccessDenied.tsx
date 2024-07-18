import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { AuthType } from "../types"

const AccessDenied = () => {
  const { auth } = useContext(AuthContext) as { auth: AuthType }
  return (
    <div>
      <h1>Access Denied</h1>
      <p>{auth?.email} is not allowed to access this page</p>
    </div>
  )
}

export default AccessDenied