import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTasksOfUser } from "../../redux/taskSlice";
import TaskModal from "../../components/TaskModal";
import TaskByCategory from "../../components/TaskByCategory";
import AddTask from "../../components/AddTask";
import { allStatus } from "../../utils/constant";

function NotesAdmin() {
  const { personTasksOfId, openTaskModal } = useSelector((state) => state.task);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [openMoreModal, setOpenMoreModal] = React.useState({
    show: false,
    task: {},
  });
  useEffect(() => {
    dispatch(
      getAllTasksOfUser({
        dispatch,
        userId: user._id,
        action: import.meta.env.VITE_TASK_READ,
      })
    );
  }, []);
  return (
    <div>
      {openTaskModal.open && (
        <TaskModal allStatus={allStatus} openTaskModal={openTaskModal.task} />
      )}
      {/* Input Field */}
      <div className="mb-6">
        <AddTask />
      </div>

      {/* Task Columns */}
      <div className="">
        <TaskByCategory
          openMoreModal={openMoreModal}
          setOpenMoreModal={setOpenMoreModal}
          tasks={personTasksOfId}
        />
      </div>
    </div>
  );
}

export default NotesAdmin;
