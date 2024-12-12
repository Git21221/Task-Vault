import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setOpenTaskModal, updateTask } from "../redux/taskSlice";
import { Button, FormWrapper } from "form-snippet";
import { allStatus } from "../utils/constant";

function TaskModal({ openTaskModal }) {
  const [task, setTask] = useState(openTaskModal?.title || "");
  const [status, setStatus] = useState(openTaskModal?.status || "");
  const [description, setDescription] = useState(
    openTaskModal?.description || ""
  );
  const taskRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (taskRef.current && !taskRef.current.contains(e.target)) {
        if (
          task !== openTaskModal?.title ||
          status !== openTaskModal?.status ||
          description !== openTaskModal?.description
        ) {
          dispatch(
            updateTask({
              dispatch,
              title: task,
              description: description || "",
              status: status,
              taskId: openTaskModal?._id,
              userId: openTaskModal?.owner?._id,
              action: import.meta.env.VITE_TASK_UPDATE,
            })
          );
        }
        dispatch(setOpenTaskModal(false));
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [task, description, status, dispatch, openTaskModal]);

  const handleTaskAdd = (e) => {
    e.preventDefault();
    if (task) {
      dispatch(
        updateTask({
          dispatch,
          title: task,
          description: description || "",
          status: status,
          taskId: openTaskModal?._id,
          userId: openTaskModal?.owner?._id,
          action: import.meta.env.VITE_TASK_UPDATE,
        })
      );
    }
    setDescription("");
    setTask("");
    dispatch(setOpenTaskModal({ open: false, task: {} }));
  };

  const handleTask = (e) => setTask(e.target.value);
  const handleDescription = (e) => setDescription(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);

  return (
    <div className="fixed z-10 inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div
        ref={taskRef}
        className="bg-white rounded-lg shadow-md"
        style={{
          maxWidth: "90%", // Maximum width is 90% of the viewport
          width: "100%", // Default to full width
          minWidth: "300px", // Minimum width to ensure usability
          maxWidth: "700px", // Maximum width when space allows
        }}
      >
        <FormWrapper>
          <div className="rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full px-4 py-3 flex flex-col items-end gap-4">
            <div className="w-full flex flex-col gap-4">
              <input
                value={task}
                onChange={handleTask}
                type="text"
                placeholder="Title"
                className="w-full focus:outline-none bg-transparent"
              />
              <hr />
              <textarea
                value={description}
                onChange={handleDescription}
                type="text"
                placeholder="Description"
                className="w-full focus:outline-none bg-transparent resize-y"
              />
            </div>
            <div className="infoOfTask w-full text-xs flex justify-between">
              <p>Created by: {openTaskModal?.owner.fullName}</p>
              <p>
                Edited:{" "}
                {new Date(openTaskModal?.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex justify-between w-full text-xs items-end">
              <div className="relative">
                <select
                  id="statusDropdown"
                  value={status}
                  onChange={handleStatusChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {allStatus.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleTaskAdd} variant="outlined">
                Save
              </Button>
            </div>
          </div>
        </FormWrapper>
      </div>
    </div>
  );
}

export default TaskModal;
