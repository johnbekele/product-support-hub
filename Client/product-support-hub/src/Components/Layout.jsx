import { Outlet } from 'react-router-dom';
import UserDashboard from '../Pages/Dashboards/UserDashboard';
import UserNavBar from '../Components/UserNavBar';

const Layout = () => {
  return (
    <div>
      <UserNavBar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
