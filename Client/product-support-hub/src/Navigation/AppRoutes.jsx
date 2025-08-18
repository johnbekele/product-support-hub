import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import Layout from '../Components/Layout.jsx';

const UserDashboard = lazy(() =>
  import('../Pages/Dashboards/UserDashboard.jsx')
);
const LoginPage = lazy(() => import('../Pages/LoginPage.jsx'));
const AddPostForm = lazy(() => import('../Components/AddPostForm.jsx'));
const UserManagementPage=lazy(()=> import ('../Pages/Dashboards/UserManagementPage.jsx'));
const AppRoutes = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<UserDashboard />} /> {/* Matches "/" */}
              <Route path="bugfeed" element={<UserDashboard />} />
              <Route path="createpost" element={<AddPostForm />} />
              <Route path="/KB-Managment" element={<UserManagementPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
