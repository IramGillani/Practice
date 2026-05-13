import { useState, useEffect } from "react";
import { ArrowLeft, Search, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import DeleteConfirmationModal from "@/components/DeleteModal";
import { UserTable } from "@/components/AdminComps/UserTable";
import { TaskTable } from "@/components/AdminComps/TaskTable";
import { StatCards } from "@/components/AdminComps/StatCards";
import type { DashboardData } from "@/types";

import { useNavigate } from "react-router-dom";
import { adminService } from "@/api/adminApi";
import { PaginationControls } from "@/components/AdminComps/Pagination";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<DashboardData>({
    users: [],
    tasks: [],
    stats: {
      totalUsers: 0,
      totalTasks: 0,
      completedTasks: 0,
    },
    userPagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
    taskPagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchDashboardData = async (userPage = 1, taskPage = 1) => {
    setLoading(true);
    try {
      const [statsRes, tasksRes, usersRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllTasks(taskPage, 10),
        adminService.getAllUsers(userPage, 10),
      ]);

      setData((prev) => ({
        ...prev,
        stats: statsRes.data,
        users: usersRes.data,
        tasks: tasksRes.data,
        userPagination: usersRes.pagination,
        taskPagination: tasksRes.pagination,
      }));
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "user" | "task" | null;
    id: string | null;
  }>({
    isOpen: false,
    type: null,
    id: null,
  });

  const openDeleteModal = (type: "user" | "task", id: string) => {
    setModalConfig({ isOpen: true, type, id });
  };

  const handleConfirmDelete = async () => {
    const { type, id } = modalConfig;
    if (!id) return;

    try {
      if (type === "user") {
        await adminService.deleteUser(id);
        setData((prev) => ({
          ...prev,
          users: prev.users.filter((u) => u._id !== id),
        }));
      } else {
        await adminService.deleteTask(id);
        setData((prev) => ({
          ...prev,
          tasks: prev.tasks.filter((t) => t._id !== id),
        }));
      }
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
    }
  };

  return (
    <div className="min-h-screen  p-6">
      <DeleteConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title={modalConfig.type === "user" ? "Delete User" : "Delete Task"}
        description={
          modalConfig.type === "user"
            ? "Are you sure you want to delete this user? This will remove their account and all associated tasks permanently."
            : "Are you sure you want to delete this task? This action is permanent."
        }
      />
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 -ml-3 "
      >
        <ArrowLeft size={16} />
        Back
      </Button>{" "}
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
          Admin Overview
        </h1>
        <Button
          onClick={() => fetchDashboardData()}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 text-gray-700"
        >
          <RefreshCw size={18} />
          Refresh
        </Button>
      </header>
      {loading && (
        <p className="text-center text-2xl text-blue-400">Loading...</p>
      )}
      <StatCards stats={data.stats} />
      <Card className="my-6">
        <CardContent className="p-4 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-75">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users or tasks..."
              className="pl-10"
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {" "}
          <UserTable
            users={data.users.filter(
              (u) =>
                u.name.toLowerCase().includes(filter.toLowerCase()) ||
                u.email.toLowerCase().includes(filter.toLowerCase()),
            )}
            onDeleteUser={(id) => openDeleteModal("user", id)}
          />
          <PaginationControls
            pagination={data.userPagination}
            onPageChange={(page) =>
              fetchDashboardData(page, data.userPagination.currentPage)
            }
          />
        </div>
        <div>
          <TaskTable
            tasks={data.tasks.filter((t) =>
              t.text.toLowerCase().includes(filter.toLowerCase()),
            )}
            onDeleteTask={(id) => openDeleteModal("task", id)}
          />

          <PaginationControls
            pagination={data.taskPagination}
            onPageChange={(page) =>
              fetchDashboardData(data.taskPagination.currentPage, page)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
