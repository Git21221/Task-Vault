import React, { useState } from "react";
import { FormWrapper, Input, Button, SelectInput } from "form-snippet";
import { useDispatch } from "react-redux";
import { userSignup } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { adminSignup } from "../redux/adminSlice";
import { modSignup } from "../redux/modSlice";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleFormSubmit = (data) => {
    dispatch(
      data.role === import.meta.env.VITE_ADMIN_ROLE
        ? adminSignup({ dispatch, data })
        : data.role === import.meta.env.VITE_MOD_ROLE
        ? modSignup({ dispatch, data })
        : userSignup({ dispatch, data })
    ).then((res) => {
      if (res.payload.code > 300) {
        setErrorMessage(res.payload.message);
        setSuccessMessage("");
      } else {
        setSuccessMessage(res.payload.message);
        setErrorMessage("");
        navigate("/signin");
      }
    });
  };

  return (
    <FormWrapper onSubmit={handleFormSubmit}>
      <div className="flex items-center h-screen">
        <div className="mx-auto p-5 flex items-center place-content-center flex-col gap-6 shadow-2xl rounded-lg">
          <h1 className="text-3xl font-bold text-center">
            Create an account with <br />{" "}
            <span className="text-[#1565C0]">Task Vault</span>
          </h1>
          {errorMessage && (
            <p className="text-red-600 text-sm bg-red-200 p-2 rounded-md">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="text-green-600 text-sm bg-green-200 p-2 rounded-md">
              {successMessage}
            </p>
          )}
          <div className="flex flex-col gap-6">
            <Input
              name="fullName"
              label="Full Name"
              type="text"
              fullWidth
              required
            />
            <Input name="email" label="Email" type="email" fullWidth required />
            <Input
              name="password"
              label="Password"
              type="password"
              fullWidth
              required
              endIcon
            />
            <SelectInput
              name="role"
              label="Select Role"
              options={[
                { value: import.meta.env.VITE_USER_ROLE, label: "User" },
                { value: import.meta.env.VITE_ADMIN_ROLE, label: "Admin" },
                { value: import.meta.env.VITE_MOD_ROLE, label: "Moderator" },
              ]}
              fullWidth
              required
            />
          </div>
          <Button variant="contained" className="w-full">
            Create Account
          </Button>
          <Button variant="text" className="w-full">
            Forgot password?
          </Button>
          <div className="flex justify-center gap-2 items-center w-full">
            Already have an account?{" "}
            <Link className="text-[#1565C0]" to="/signin">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </FormWrapper>
  );
}

export default Signup;
