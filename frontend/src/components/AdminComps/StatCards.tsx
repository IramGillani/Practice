import { ListCheck, NotebookPen, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import type { DashboardData } from "@/types";

export const StatCards = ({ stats }: { stats: DashboardData["stats"] }) => {
  const items = [
    {
      label: "Total Users",
      value: stats.data.totalUsers || 0,
      icon: <Users size={20} className="text-blue-600" />,
      bgColor: "bg-blue-100",
    },
    {
      label: "Total Tasks",
      value: stats.data.totalTasks || 0,
      icon: <NotebookPen size={20} className="text-purple-600" />,
      bgColor: "bg-purple-100",
    },
    {
      label: "Completed Tasks",
      value: `${stats.data.completedTasks || 0}`,
      icon: <ListCheck size={20} className="text-green-600" />,
      bgColor: "bg-green-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((stat, i) => (
        <Card
          key={i}
          className="border-b-4 border-b-slate-200 dark:border-b-[#2d2e30]"
        >
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className={`p-3 ${stat.bgColor} rounded-full mb-4`}>
              {stat.icon}
            </div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </p>
            <h2 className="text-3xl font-bold mt-2">{stat.value}</h2>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
