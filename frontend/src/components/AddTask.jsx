import { Button, FormWrapper } from "form-snippet";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createTask } from "../redux/taskSlice";

function AddTask() {
  const dispatch = useDispatch();
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [taskCrete, setTaskCrete] = useState(false);
  const oustsideClickRef = useRef(null);
  const handleTaskAdd = (e) => {
    e.preventDefault();
    task
      ? dispatch(createTask({ title: task, description: description || "" }))
      : null;
    setTaskCrete(false);
    setDescription("");
    setTask("");
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        oustsideClickRef.current &&
        !oustsideClickRef.current.contains(e.target)
      ) {
        //save task to backend
        task
          ? dispatch(
              createTask({ title: task, description: description || "" })
            )
          : null;
        setTaskCrete(false);
        setDescription("");
        setTask("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [task]);
  const handleTask = (e) => {
    setTask(e.target.value);
  };
  const handleDescription = (e) => {
    setDescription(e.target.value);
  };
  const handleTaskCreateClick = () => {
    setTaskCrete(true);
  };
  return (
    <FormWrapper>
      <div
        ref={oustsideClickRef}
        className={`rounded-lg border shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full px-4 py-3 flex flex-col items-end ${
          taskCrete ? "gap-4" : ""
        }`}
      >
        <div className="w-full flex flex-col gap-4">
          <input
            onClick={handleTaskCreateClick}
            value={task}
            onChange={handleTask}
            type="text"
            placeholder="Title"
            className=" w-full focus:outline-none bg-transparent"
          />
          {taskCrete ? <hr /> : null}
          {taskCrete ? (
            <textarea
              value={description}
              onChange={handleDescription}
              type="text"
              placeholder="Description"
              className=" w-full focus:outline-none bg-transparent resize-y"
            />
          ) : null}
        </div>
        <div className="flex items-end">
          {taskCrete ? (
            <Button onClick={handleTaskAdd} variant="outlined">
              Save
            </Button>
          ) : null}
        </div>
      </div>
    </FormWrapper>
  );
}

export default AddTask;
