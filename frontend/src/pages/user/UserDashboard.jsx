import React, { useEffect, useState } from "react";
import Sidebar from "../../components/user/Sidebar";
import Navbar from "../../components/user/Navbar";
import AddTask from "../../components/AddTask";
import { useDispatch, useSelector } from "react-redux";
import { getAllTasks } from "../../redux/taskSlice";
import TaskByCategory from "../../components/TaskByCategory";
import TaskModal from "../../components/taskModal";

function UserDashboard() {
  const { tasks, openTaskModal } = useSelector((state) => state.task);
  const [allStatus, setAllStatus] = useState([]);
  const dispatch = useDispatch();
  const [openMoreModal, setOpenMoreModal] = React.useState({
    show: false,
    task: {},
  });
  useEffect(() => {
    dispatch(getAllTasks()).then((res) => {
      if (res.payload.data) {
        const status = res.payload.data.map((task) => task.status);
        setAllStatus([...new Set(status)]);
      }
    });
  }, [dispatch]);
  return (
    <div>
      {openTaskModal.open && <TaskModal openTaskModal={openTaskModal.task} />}
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Dashboard Content */}
        <div className="flex-1 p-4 w-full h-[calc(100vh-62px)] overflow-y-auto">
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
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
