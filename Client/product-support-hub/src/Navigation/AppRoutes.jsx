import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';

const UserDashboard = lazy(() =>
  import('../Pages/Dashboards/UserDashboard.jsx')
);
const LoginPage = lazy(() => import('../Pages/LoginPage.jsx'));

const AppRoutes = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes wrapper */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<UserDashboard />} />
            {/* Add more protected nested routes here if needed */}
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
