import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore, useProfileStore } from '../store';

export function ProtectedRoute() {
  const { user } = useAuthStore();
  const { lockedEmail, setLockedEmail } = useProfileStore();

  useEffect(() => {
    // If user is logged in from global launcher, sync to store
    if (user?.email && !lockedEmail) {
      setLockedEmail(user.email);
    }
  }, [user, lockedEmail, setLockedEmail]);

  // Immediately render the application - authentication is handled globally via the App Launcher
  return <Outlet />;
}
