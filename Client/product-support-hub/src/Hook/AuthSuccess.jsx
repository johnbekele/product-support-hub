// In AuthSuccess.jsx
import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../Context/AuthContext';
import LoadingSpinner from '../Components/LoadingSpinner';
import { useLogger } from '../Hook/useLogger';

const AuthSuccess = () => {
  const { user, loading, setActiveRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const logger = useLogger();
  const [chooseRole, setChooseRole] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      logger.log('No user found, redirecting to login');
      navigate('/login', { replace: true });
      return;
    }

    // Check if a role has already been selected
    const selectedRole = localStorage.getItem('selectedRole');
    if (selectedRole && user.role) {
      // Verify the selected role is still valid
      const roleValue = user.role[selectedRole];
      const minValues = { Admin: 4001, Moderator: 3001, User: 2001 };

      if (roleValue >= minValues[selectedRole]) {
        logger.log(`Using previously selected role: ${selectedRole}`);
        navigate(`/${selectedRole.toLowerCase()}-dashboard`, { replace: true });
        return;
      } else {
        // Clear invalid role selection
        localStorage.removeItem('selectedRole');
      }
    }

    // Role-based redirect if user only has one valid role
    if (user.role) {
      const { Admin, Moderator, User } = user.role;

      // Count valid roles
      let validRoleCount = 0;
      if (Admin >= 4001) validRoleCount++;
      if (Moderator >= 3001) validRoleCount++;
      if (User >= 2001) validRoleCount++;

      if (validRoleCount > 1) {
        // User has multiple roles, show selection screen
        setChooseRole(true);
      } else if (Admin >= 4001) {
        // Only Admin role
        setActiveRole('Admin');
      } else if (Moderator >= 3001) {
        // Only Moderator role
        setActiveRole('Moderator');
      } else if (User >= 2001) {
        // Only User role
        setActiveRole('User');
      } else {
        // No valid roles
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, navigate, setActiveRole]);

  const handleRoleSelect = (role) => {
    setActiveRole(role);
  };

  if (loading) return <LoadingSpinner />;

  if (chooseRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-semibold mb-4">
          Hey {user.firstname}, we found multiple roles!
        </h2>
        <p className="mb-6">Please choose where you want to go:</p>
        <div className="flex gap-4">
          {user.role.Admin >= 4001 && (
            <button
              onClick={() => handleRoleSelect('Admin')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Admin Dashboard
            </button>
          )}
          {user.role.Moderator >= 3001 && (
            <button
              onClick={() => handleRoleSelect('Moderator')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Moderator Dashboard
            </button>
          )}
          {user.role.User >= 2001 && (
            <button
              onClick={() => handleRoleSelect('User')}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              User Dashboard
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2>Authentication Successful</h2>
      <p>Redirecting you to your dashboard...</p>
      <LoadingSpinner />
    </div>
  );
};

export default AuthSuccess;
