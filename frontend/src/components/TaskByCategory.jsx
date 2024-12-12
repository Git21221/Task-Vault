import React from "react";
import { useDispatch } from "react-redux";
import { deleteTask, setOpenTaskModal } from "../redux/taskSlice";
import { RiDeleteBin6Line } from "react-icons/ri";

function TaskByCategory({ tasks }) {
  const dispatch = useDispatch();
  const [taskHover, setTaskHover] = React.useState({
    hover: false,
    id: "",
  });

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {tasks.map((task) => (
        <div
          key={task._id}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(setOpenTaskModal({ open: true, task }));
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            setTaskHover({ hover: true, id: task._id });
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            setTaskHover({ hover: false, id: "" });
          }}
          className="border h-min flex flex-col gap-4 w-[300px] rounded-lg p-4 pb-16 relative"
        >
          <p className="font-medium text-lg">{task?.title}</p>

          <p className="font-light">{task?.description || ""}</p>
          <div
            className={`absolute bottom-4 transition-opacity ${
              taskHover.hover && taskHover.id === task._id
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            <RiDeleteBin6Line onClick={(e) => {
              e.stopPropagation();
              dispatch(deleteTask({ dispatch, taskId: task._id, userId: task.owner, action: import.meta.env.VITE_TASK_DELETE }));
            }} className="text-red-500 text-4xl p-2 hover:bg-red-100 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskByCategory;
