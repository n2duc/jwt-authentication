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

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"

import { MoreHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { AuthType, DataUserRespone } from "../types";
import PaginationBar from "./PaginationBar";

const PAGE_SIZE = 10

const ListUsersTable = ({ data }: { data: DataUserRespone }) => {
  const { users, currentPage, totalPages } = data
  // const [currentPage, setCurrentPage] = useState(1)

  // const currentTableData = useMemo(() => {
  //   const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
  //   const lastPageIndex = firstPageIndex + PAGE_SIZE;
  //   return users.slice(firstPageIndex, lastPageIndex);
  // }, [currentPage, users]);

  const firstItemIndex = (currentPage - 1) * PAGE_SIZE + 1;
  const lastItemIndex = Math.min(currentPage * PAGE_SIZE, users.length)

  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
        <CardDescription>
          Manage accounts and view their infomations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                No.
              </TableHead>
              <TableHead>
                ID
              </TableHead>
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
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">
                  {users.indexOf(user) + 1}
                </TableCell>
                <TableCell className="font-medium">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p>{`${user._id?.slice(0, -4)}****`}</p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{user._id}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
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
      </CardContent>
      <CardFooter className="flex items-center">
        <div className="text-xs text-muted-foreground flex-1">
          Showing <strong>{firstItemIndex}-{lastItemIndex}</strong> of <strong>{users.length}</strong> products
        </div>
        <PaginationBar
          currentPage={currentPage}
          totalCount={users.length}
          pageSize={PAGE_SIZE}
          onPageChange={page => setCurrentPage(page)}
        />
      </CardFooter>
    </Card>
  );
};

export default ListUsersTable;