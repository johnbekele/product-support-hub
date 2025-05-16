export const saveCurrentPath = () => {
  // Save current path to sessionStorage when navigating
  const savePathToSession = () => {
    sessionStorage.setItem('lastPath', window.location.pathname);
  };

  // Add event listener for beforeunload
  window.addEventListener('beforeunload', savePathToSession);

  // Also save the path immediately when this function is called
  savePathToSession();

  // Clean up the event listener when not needed
  return () => {
    window.removeEventListener('beforeunload', savePathToSession);
  };
};

export const restoreLastPath = (navigate) => {
  // Try to get the last path from sessionStorage
  const lastPath = sessionStorage.getItem('lastPath');

  // Get the current path
  const currentPath = window.location.pathname;

  // Check if we're at the root (/) or if the path has changed dashboards
  const isDashboardRoot = currentPath.endsWith('-dashboard');

  // If there's a saved path and we're at root or dashboard root, restore
  if (lastPath && (currentPath === '/' || isDashboardRoot)) {
    // Only restore if the dashboard type matches
    // For example, don't restore user-dashboard/profile when on admin-dashboard
    const currentDashboard = currentPath.split('/')[1]; // e.g., "admin-dashboard"
    const savedDashboard = lastPath.split('/')[1]; // e.g., "user-dashboard"

    if (currentPath === '/' || currentDashboard === savedDashboard) {
      navigate(lastPath);
    }
  }
};
