import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

const UserDashboard = lazy(() =>
  import('../Pages/Dashboards/UserDashboard.jsx')
);
const AppRoutes = () => {
  return (
    <Router>
      <InnerRoutes />
    </Router>
  );
};

const InnerRoutes = () => {
  return (
    <Routes>
      {/* Home */}
      <Route
        path="/"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <UserDashboard />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
