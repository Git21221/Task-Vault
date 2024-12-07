import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { apiClient } from "../../utils/apiClient";

function Home() {
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    const fetchData = async () => {
      const data = await apiClient(
        `users/get-user-profile/${user._id}/${import.meta.env.VITE_PROFILE_READ}`,
        "GET"
      );
      console.log(data);
    };
    fetchData();
  }, []);
  return <div>Home {user.fullName}</div>;
}

export default Home;
