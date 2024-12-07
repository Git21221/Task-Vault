import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({children}) {
  const {user, userRole} = useSelector(state => state.auth);
  console.log(user, userRole);
  
  if(!user) {
    return <Navigate to="/signin" replace />
  }
  else return children;
}

export default ProtectedRoute