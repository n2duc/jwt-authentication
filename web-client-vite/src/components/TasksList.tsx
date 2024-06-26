import { useEffect, useState } from "react";
import axiosInstance from "../lib/authorizedAxios";
import { cn } from "../lib/utils";

import { Alert, AlertTitle } from "../components/ui/alert";
import { Switch } from "../components/ui/switch"
import TaskSkeleton from "./TaskSkeleton";

type Task = {
  _id: string;
  title: string;
  completed: boolean;
};

const TasksList = ({ className }: { className: string }) => {
  const [tasks, setTasks] = useState<Task[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get(`/tasks`)
      setTasks(response.data);
    };
    fetchData();
  }, []);

  if (!tasks) {
    return <TaskSkeleton />
  }

  return (
    <div className={cn(className)}>
      <h2 className="text-xl font-bold">Task List</h2>
      <ul className="flex flex-col gap-2 mt-2">
        {tasks.length === 0 ? (
          <div className="px-4 py-2 rounded-sm border border-slate-300 shadow-sm text-sm font-medium">No tasks</div>
        ) : (
          tasks.map((task: Task) => (
            <Task key={task._id} task={task} />
          ))
        )}
      </ul>
    </div>
  );
};

const Task = ({ task }: { task: Task }) => {
  const [completed, setCompleted] = useState(task.completed);
  
  const handleCheckTask = async (taskId: string) => {
    setCompleted(!completed)
    await axiosInstance.put(`/tasks/${taskId}`, { completed: !completed });
  }

  return (
    <Alert
      key={task._id}
      className={cn(
        completed
          ? "border-emerald-400 bg-emerald-50"
          : "border-red-300 bg-red-50",
        "flex items-center justify-between"
      )}
    >
      <AlertTitle>{task.title}</AlertTitle>
      <Switch checked={completed} onCheckedChange={() => handleCheckTask(task._id)} />
    </Alert>
  )
}

export default TasksList;
