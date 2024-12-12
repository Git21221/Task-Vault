import React, { useState } from "react";
import { FormWrapper, Input, Button } from "form-snippet";
import { useDispatch, useSelector } from "react-redux";
import { userSignin } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";

function Signin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const loading = useSelector((state) => state.ui.loading);

  const handleFormSubmit = (data) => {
    dispatch(userSignin({ dispatch, data })).then((res) => {
      if (res.payload.code > 300) {
        setErrorMessage(res.payload.message);
        setSuccessMessage("");
      } else {
        setSuccessMessage(res.payload.message);
        setErrorMessage("");
        navigate("/");
      }
    });
  };
  if (loading) return null;
  return (
    <FormWrapper onSubmit={handleFormSubmit}>
      <div className="flex items-center h-screen">
        <div className="max-w-[400px] mx-auto p-5 flex items-center place-content-center flex-col gap-6 shadow-2xl rounded-lg">
          <h1 className="text-3xl font-bold">
            Log In to <span className="text-[#1565C0]">Task Vault</span>
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
            <Input name="email" label="Email" type="email" fullWidth required />
            <Input
              name="password"
              label="Password"
              type="password"
              fullWidth
              required
              endIcon
            />
          </div>
          <Button variant="contained" className="w-full">
            Sign in
          </Button>
          <Button variant="text" className="w-full">
            Forgot password?
          </Button>
          <div className="flex justify-center gap-2 items-center w-full">
            Not a member?{" "}
            <Link to="/signup" className="text-[#1565C0]">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </FormWrapper>
  );
}

export default Signin;
