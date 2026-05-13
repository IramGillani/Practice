import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import type { TaskTableProps } from "@/types";

export const TaskTable = ({ tasks, onDeleteTask }: TaskTableProps) => (
  <Card>
    <CardHeader className="bg-muted/50 py-4 flex flex-row items-center justify-between space-y-0">
      <CardTitle className="text-base font-semibold">Task Management</CardTitle>
      <Badge variant="secondary">{tasks.length} Total</Badge>
    </CardHeader>
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="uppercase text-xs font-medium">
            <TableHead>Task Title</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TableRow key={task._id}>
                <TableCell className="font-medium">{task.text}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {task.userId?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {task.userId?.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={task.completed ? "success" : ("warning" as any)}
                    className={
                      task.completed
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                    }
                  >
                    {task.completed ? "Completed" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteTask(task._id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-24 text-center text-muted-foreground"
              >
                No tasks found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  </Card>
);
