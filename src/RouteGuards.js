import React from 'react';
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // Check if the token exists
  return isAuthenticated ? children : <Navigate to="/" />;
};

export const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // Check if the token exists
  return isAuthenticated ? <Navigate to="/scannotice" /> : children;
};
