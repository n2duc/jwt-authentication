import { useEffect, useState } from "react";
import axiosInstance from "../lib/authorizedAxios";
import { cn } from "../lib/utils";

import { Alert, AlertTitle } from "../components/ui/alert";
import { Switch } from "../components/ui/switch"
import { Button } from "../components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../components/ui/form"
import { Input } from "../components/ui/input"
import TaskSkeleton from "./TaskSkeleton";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import toast from "react-hot-toast"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Content must be at least 2 characters.",
  }),
})

type Task = {
  _id: string;
  title: string;
  completed: boolean;
};

const TasksList = ({ className }: { className: string }) => {
  const [tasks, setTasks] = useState<Task[] | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await axiosInstance.post(`/tasks`, { title: values.title });
    form.reset();
    const response = await axiosInstance.get(`/tasks`)
    setTasks(response.data);
    toast.success("Task added successfully")
  }

  return (
    <div className={cn(className)}>
      <h2 className="text-xl font-bold mb-2">Task List</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex items-center gap-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Add new</Button>
        </form>
      </Form>
      <ul className="flex flex-col gap-2 mt-2">
        {tasks.length === 0 ? (
          <div className="px-4 py-2 rounded-sm border border-slate-300 shadow-sm text-sm font-medium">No tasks</div>
        ) : (
          tasks.map((task: Task) => (
            <TaskItem key={task._id} task={task} />
          ))
        )}
      </ul>
    </div>
  );
};

const TaskItem = ({ task }: { task: Task }) => {
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
      <AlertTitle className="mb-0">{task.title}</AlertTitle>
      <Switch checked={completed} onCheckedChange={() => handleCheckTask(task._id)} />
    </Alert>
  )
}

export default TasksList;