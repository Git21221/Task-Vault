import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom'

function ModeratorLayout() {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getCurrentPerson({
        userId: user._id,
        action: import.meta.env.VITE_PROFILE_READ,
      })
    );
  }, [dispatch]);
  return (
    <Outlet />
  )
}

export default ModeratorLayout