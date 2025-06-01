import React from 'react';
import { useThomsonReutersTheme } from '../../Context/ThomsonReutersThemeContext';
import BugSearchBar from '../../Components/BugSearchBar';
import BugFeedPage from '../../Components/BugFeedPage';
import UserNavBar from '../../Components/UserNavBar';
import { usePost } from '../../Hook/usePost';
function UserDashboard() {
  const theme = useThomsonReutersTheme();

  const bodyStyle = {
    backgroundColor: theme.components.body.backgroundColor,
    color: theme.components.body.color,
    padding: theme.spacing.lg,
  };

  const buttonStyle = {
    backgroundColor: theme.components.button.primary.backgroundColor,
    color: theme.components.button.primary.color,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <div>
      <UserNavBar theme={theme} />
      <div className="">
        <BugSearchBar />
        <BugFeedPage />
      </div>
    </div>
  );
}

export default UserDashboard;
