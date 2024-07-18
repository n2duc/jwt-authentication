import { createContext, useEffect, useState } from "react"
import { getMeAPI } from "../apis"
import { AuthType } from "../types"

export const AuthContext = createContext({})

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthType | null>(null)

  useEffect(() => {
    (async () => {
      const authData = await getMeAPI()
      setAuth(authData)
    })()
  }, [])

  return <AuthContext.Provider value={{ auth }}>{children}</AuthContext.Provider>
}

export default AuthProvider