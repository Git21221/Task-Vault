import React, { useEffect } from "react";
import { deleteTask, setOpenTaskModal } from "../redux/taskSlice";
import { useDispatch, useSelector } from "react-redux";
import { CgMoreVerticalAlt } from "react-icons/cg";

function TaskByCategory({
  taskName,
  tasks,
  userTasks,
  modTasks,
  adminTasks,
  status,
  openMoreModal,
  setOpenMoreModal,
}) {
  const dispatch = useDispatch();
  const handleMoreRef = React.useRef(null);
  const [moreOptions, setMoreOptions] = React.useState({
    show: false,
    _id: null,
  });
  useEffect(() => {
    const handleOutsideClick = (e) => {
      e.stopPropagation();
      if (handleMoreRef.current && !handleMoreRef.current.contains(e.target)) {
        setOpenMoreModal({ show: false, task: {} });
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [openMoreModal]);

  return (
    <div
      key={status}
      className={`${
        taskName === "created"
          ? "bg-blue-100"
          : taskName === "in-progress"
          ? "bg-yellow-100"
          : "bg-green-100"
      } rounded-lg shadow p-4`}
    >
      <h3
        ref={handleMoreRef}
        className={`text-lg font-semibold mb-4 ${
          taskName === "created"
            ? "text-blue-800"
            : taskName === "in-progress"
            ? "text-yellow-800"
            : "text-green-800"
        }`}
      >
        {taskName}
      </h3>
      {/* Add tasks dynamically */}
      <ul className="space-y-2 relative">
        {tasks?.map((task, idx) => (
          <React.Fragment key={idx}>
            <li
              key={idx}
              onMouseEnter={() => setMoreOptions({ show: true, _id: task._id })}
              onMouseLeave={() => setMoreOptions({ show: false, _id: null })}
              onClick={(e) => {
                dispatch(setOpenTaskModal({ open: true, task }));
              }}
              className={`${
                taskName === "created"
                  ? "bg-blue-200"
                  : taskName === "in-progress"
                  ? "bg-yellow-200"
                  : "bg-green-200"
              } rounded-lg p-3 shadow flex justify-between items-center cursor-pointer relative`}
            >
              {task.title}
              {(moreOptions.show && moreOptions._id === task._id) ||
              (openMoreModal.open && openMoreModal.task._id === task._id) ? (
                <div
                  className="p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMoreModal({ open: true, task });
                  }}
                >
                  <CgMoreVerticalAlt />
                </div>
              ) : null}
            </li>
            {openMoreModal.open && openMoreModal.task._id === task._id && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {console.log(task)}
                <ul className="py-2">
                  <li
                    onMouseDown={(e) => {
                      console.log("Edit task");
                      e.stopPropagation();
                      dispatch(setOpenTaskModal({ open: true, task }));
                      setOpenMoreModal({ show: false, task: {} });
                    }}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Edit Task
                  </li>
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(
                        deleteTask({
                          taskId: task._id,
                          userId: task.owner._id,
                          action: import.meta.env.VITE_TASK_DELETE,
                        })
                      );
                    }}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Delete Task
                  </li>
                  <li
                    // onClick={handleTransfer}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Transfer Task
                  </li>
                </ul>
              </div>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}

export default TaskByCategory;
