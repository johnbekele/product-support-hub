import React, { useEffect } from 'react';
import { useThomsonReutersTheme } from '../../Context/ThomsonReutersThemeContext';
import BugSearchBar from '../../Components/BugSearchBar';
import BugFeedPage from '../../Components/BugFeedPage';
import { useBugContext } from '../../Context/BugContext';

function UserDashboard() {
  const theme = useThomsonReutersTheme();
  const [iscreatePost, setIsCreatePost] = React.useState(false);
  const { selectedBugId } = useBugContext();
  // State for search and filters
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState({
    product: '',
    bugType: '',
    status: '',
    severity: '',
    assignee: '',
    dateRange: 'all',
    id: null,
  });

  // Handlers for search and filter updates
  const handleSearch = (newSearchTerm) => setSearchTerm(newSearchTerm);
  const handleFilterChange = (newFilters) => setFilters(newFilters);
  const handlePost = () => setIsCreatePost(!iscreatePost);

  const bodyStyle = {
    backgroundColor: theme.components.body.backgroundColor,
    color: theme.components.body.color,
    padding: theme.spacing.lg,
  };

  // Update filters when selectedBugId changes
  useEffect(() => {
    if (selectedBugId) {
      // Update filters with the new bug ID
      setFilters((prevFilters) => ({
        ...prevFilters,
        id: selectedBugId,
      }));

      // Optionally, you can also set the search term to the bug ID
      setSearchTerm(selectedBugId.toString());
    }
  }, [selectedBugId]);

  return (
    <div style={bodyStyle}>
      <div>
        <BugSearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <BugFeedPage
          searchTerm={searchTerm}
          filters={filters}
          selectedBugId={selectedBugId}
        />
      </div>
    </div>
  );
}

export default UserDashboard;
