import React, { useEffect } from "react";
import AddTask from "../../components/AddTask";
import { useDispatch, useSelector } from "react-redux";
import { getAllTasks } from "../../redux/taskSlice";
import TaskByCategory from "../../components/TaskByCategory";
import TaskModal from "../../components/TaskModal";
import { allStatus } from "../../utils/constant";

function UserDashboard() {
  const { tasks, modTasks, adminTasks, openTaskModal } = useSelector((state) => state.task);
  const userTasks = useSelector((state) => state.task.userTasks);
  console.log(adminTasks);
  
  const dispatch = useDispatch();
  const [openMoreModal, setOpenMoreModal] = React.useState({
    show: false,
    task: {},
  });
  useEffect(() => {
    dispatch(getAllTasks());
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
      <div className="grid grid-cols-3 gap-6">
        {allStatus.map((status) => (
          <TaskByCategory
            openMoreModal={openMoreModal}
            setOpenMoreModal={setOpenMoreModal}
            status={status}
            taskName={status}
            tasks={tasks.filter((task) => task.status === status)}
            userTasks={userTasks}
            modTasks={modTasks}
            adminTasks={adminTasks}
          />
        ))}
      </div>
    </div>
  );
}

export default UserDashboard;
