import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useSaveLastLocation = () => {
  const location = useLocation();

  useEffect(() => {
    // Skip saving certain paths as "last location"
    const pathsToIgnore = ['/login', '/auth-success'];

    if (!pathsToIgnore.includes(location.pathname)) {
      localStorage.setItem('lastVisitedPath', location.pathname);
    }
  }, [location.pathname]);
};

export default useSaveLastLocation;
