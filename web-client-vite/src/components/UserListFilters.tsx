import { useState } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { useDebounce } from "../hooks/useDebounce"
import { UserFilters } from "../types"

const UserListFilters = () => {
  const [search, setSearch] = useState<UserFilters['search']>("")
  const debouncedSearch = useDebounce(search)

  const [role, setRole] = useState<UserFilters['role']>()
  const handleRoleChange = (value: string) => {
    setRole(value as UserFilters['role'])
  }

  return (
    <div className="flex min-w-[500px] gap-4">
      <Input type="text" value={search} placeholder="Search users" onChange={(e) => setSearch(e.target.value)} />
      <Select onValueChange={handleRoleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="user">User</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserListFilters;