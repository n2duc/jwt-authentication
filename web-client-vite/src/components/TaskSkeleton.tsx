import { Skeleton } from "./ui/skeleton";

const TaskSkeleton = () => {
  return (
    <div className="flex-1">
      <h2 className="text-xl font-bold">Task List</h2>
      <ul className="flex flex-col gap-2 mt-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-11" />
        ))}
      </ul>
    </div>
  );
};

export default TaskSkeleton;
