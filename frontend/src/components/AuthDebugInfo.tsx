import React from "react";
import { useAuthStore } from "@/stores";

const AuthDebugInfo: React.FC = () => {
  const { user, isAuthenticated, isLoading, error } = useAuthStore();

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <div className="font-bold mb-2">Auth Debug Info:</div>
      <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
      <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
      <div>User: {user ? user.name : 'None'}</div>
      <div>Avatar: {user?.avatar ? 'Yes' : 'No'}</div>
      <div>Token: {localStorage.getItem('authToken') ? 'Present' : 'Missing'}</div>
      {error && <div className="text-red-400">Error: {error}</div>}
    </div>
  );
};

export default AuthDebugInfo;
