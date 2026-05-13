import type { UserTableProps } from "@/types";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const UserTable = ({ users, onDeleteUser }: UserTableProps) => (
  <Card>
    <CardHeader className="bg-muted/50 py-4">
      <CardTitle className="text-base font-semibold">User Management</CardTitle>
    </CardHeader>
    <Table>
      <TableHeader>
        <TableRow className="uppercase text-xs font-medium">
          <TableHead>User</TableHead>
          <TableHead>Tasks</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user._id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.profileUrl} alt={user.name} />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {user.email}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className="font-semibold">{user.taskCount || 0}</span>
              <span className="text-muted-foreground ml-1">tasks</span>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteUser(user._id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Card>
);
