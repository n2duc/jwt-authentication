import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { MoreHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getListUsers } from "../apis";
import { AuthType } from "../types";
import PaginationBar from "./PaginationBar";

const PAGE_SIZE = 10

const ListUsersTable = () => {
  const [users, setUsers] = useState<AuthType[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getListUsers();
      setUsers(data);
    };
    fetchUsers();
  }, [])

  const [currentPage, setCurrentPage] = useState(1);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
    const lastPageIndex = firstPageIndex + PAGE_SIZE;
    return users.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, users]);

  if (users.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
        <CardDescription>
          Manage your products and view their sales performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTableData.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="hidden sm:table-cell">
                  <img
                    alt="Product image"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={user.avatar.url}
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {user.username}
                </TableCell>
                <TableCell className="font-medium">
                  {user.email}
                </TableCell>
                <TableCell>
                  {user.isAdmin ? (
                    <Badge variant="secondary">ADMIN</Badge>
                  ) : (
                    <Badge variant="outline">USER</Badge>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <PaginationBar
          currentPage={currentPage}
          totalCount={users.length}
          pageSize={PAGE_SIZE}
          onPageChange={page => setCurrentPage(page)}
        />
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> products
        </div>
      </CardFooter>
    </Card>
  );
};

export default ListUsersTable;
