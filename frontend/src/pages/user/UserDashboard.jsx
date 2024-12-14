import React, { useEffect } from "react";
import AddTask from "../../components/AddTask";
import { useDispatch, useSelector } from "react-redux";
import { getAllTasksOfUser } from "../../redux/taskSlice";
import TaskByCategory from "../../components/TaskByCategory";
import TaskModal from "../../components/TaskModal";
import { allStatus } from "../../utils/constant";

function UserDashboard() {
  const { personTasksOfId, openTaskModal } = useSelector((state) => state.task);
  console.log(personTasksOfId);
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
  }, [dispatch]);
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

export default UserDashboard;
