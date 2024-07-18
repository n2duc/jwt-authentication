import { Shield } from "lucide-react"
import { Outlet } from "react-router-dom"

const AuthenLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-zinc-900 to-zinc-800 relative">
      <div className="absolute top-8 left-10 flex gap-4 items-center" title="Ditmia Lang Gom Bat Trang">
        <div className="bg-white p-2 rounded-xl">
          <Shield strokeWidth={2} size={26} className="text-zinc-900" />
        </div>
        <div className="flex gap-1 text-[19px] font-bold select-none">
          <span className="text-slate-200">Authentication</span>
          <span className="text-teal-200">Master</span>
        </div>
      </div>
      <Outlet />
    </div>
  )
}

export default AuthenLayout