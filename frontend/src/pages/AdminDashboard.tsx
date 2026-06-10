import { useState, useEffect } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import DeleteConfirmationModal from "@/components/DeleteModal";
import { UserTable } from "@/components/AdminComps/UserTable";
import { TaskTable } from "@/components/AdminComps/TaskTable";
import { StatCards } from "@/components/AdminComps/StatCards";
import type { DashboardData, TabType } from "@/types";

import { TaskListSkeleton, UserListSkeleton } from "@/components/Skeletons";

import { useNavigate } from "react-router-dom";
import { adminService } from "@/api/adminApi";
import { PaginationControls } from "@/components/AdminComps/Pagination";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<DashboardData>({
    users: [],
    tasks: [],
    stats: {
      data: { totalUsers: 0, totalTasks: 0, completedTasks: 0 },
    },
    userPagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
    taskPagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
  });

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<TabType>("Users");
  const tabs: TabType[] = ["Users", "Tasks"];

  const fetchStats = async () => {
    console.log("Fetching stats API");
    try {
      const statsRes = await adminService.getDashboardStats();
      setData((prev) => ({ ...prev, stats: { data: statsRes.data } }));
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchListData = async (
    userPage = 1,
    taskPage = 1,
    search = "",
    currentTab = selectedTab,
  ) => {
    console.log("API CALL", currentTab);
    setLoading(true);
    try {
      if (currentTab === "Users") {
        const usersRes = await adminService.getAllUsers(userPage, 10, search);
        setData((prev) => ({
          ...prev,
          users: usersRes.data,
          userPagination: usersRes.pagination,
        }));
      } else {
        const tasksRes = await adminService.getAllTasks(taskPage, 10, search);
        setData((prev) => ({
          ...prev,
          tasks: tasksRes.data,
          taskPagination: tasksRes.pagination,
        }));
      }
    } catch (error) {
      console.error("Error fetching list data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Stats effect fired");
    fetchStats();
    console.log("Fetching stats data initially");
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0 && searchQuery.trim() === "") {
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      console.log(
        `Fetching data for tab: ${selectedTab} with search: "${searchQuery}"`,
      );
      fetchListData(1, 1, searchQuery, selectedTab);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedTab]);

  const handleTabChange = (tab: TabType) => {
    setLoading(true);
    setSelectedTab(tab);
  };

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
      await Promise.all([
        fetchStats(),
        fetchListData(1, 1, searchQuery, selectedTab),
      ]);
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
    }
  };

  return (
    <div className="min-h-screen p-6">
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
        className="flex items-center gap-2 -ml-3"
      >
        <ArrowLeft size={16} />
        Back
      </Button>{" "}
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
          Admin Overview
        </h1>
      </header>
      <StatCards stats={data.stats} />
      <Card className="my-6 py-2">
        <CardContent className="p-4 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-75">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={
                selectedTab === "Users" ? "Search users..." : "Search tasks..."
              }
              className="pl-10 py-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-6 border-b mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => handleTabChange(t)}
            className={`pb-2 text-lg font-semibold transition-all ${
              selectedTab === t
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="col-span-1 lg:col-span-2">
          {loading ? (
            selectedTab === "Users" ? (
              <UserListSkeleton />
            ) : (
              <TaskListSkeleton />
            )
          ) : selectedTab === "Users" ? (
            <>
              <UserTable
                users={data.users}
                onDeleteUser={(id) => openDeleteModal("user", id)}
              />
              <PaginationControls
                pagination={data.userPagination}
                onPageChange={(page) =>
                  fetchListData(
                    page,
                    data.taskPagination.currentPage,
                    searchQuery,
                    "Users",
                  )
                }
              />
            </>
          ) : (
            <>
              <TaskTable
                tasks={data.tasks}
                onDeleteTask={(id) => openDeleteModal("task", id)}
              />
              <PaginationControls
                pagination={data.taskPagination}
                onPageChange={(page) =>
                  fetchListData(
                    data.userPagination.currentPage,
                    page,
                    searchQuery,
                    "Tasks",
                  )
                }
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
