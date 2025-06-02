import React from 'react';
import { useThomsonReutersTheme } from '../../Context/ThomsonReutersThemeContext';
import BugSearchBar from '../../Components/BugSearchBar';
import BugFeedPage from '../../Components/BugFeedPage';
import { usePost } from '../../Hook/usePost';
import AddPostForm from '../../Components/AddPostForm';
function UserDashboard() {
  const theme = useThomsonReutersTheme();
  const [iscreatePost, setIsCreatePost] = React.useState(false);

  const handlePost = () => {
    setIsCreatePost(!iscreatePost);
  };

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
      <div className="">
        <BugSearchBar />
        <BugFeedPage />
      </div>
    </div>
  );
}

export default UserDashboard;
