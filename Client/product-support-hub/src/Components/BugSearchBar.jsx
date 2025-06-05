import React, { useState } from 'react';
import {
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaTimes,
  FaRobot,
} from 'react-icons/fa';

function BugSearchBar({ searchTerm, onSearchChange, filters, onFilterChange }) {
  const [showFilters, setShowFilters] = useState(false);
  const [isAiSearching, setIsAiSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm, 'with filters:', filters);
  };

  const handleAiSearch = () => {
    setIsAiSearching(true);
    // Simulate AI processing time
    setTimeout(() => setIsAiSearching(false), 2000);
  };

  const updateFilter = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFilterChange({
      product: '',
      bugType: '',
      status: '',
      severity: '',
      assignee: '',
      dateRange: 'all',
    });
  };

  // Count active filters for badge display
  const appliedFilters = Object.values(filters).filter(
    (value) => value !== '' && value !== 'all'
  ).length;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search input field */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for bugs by ID, title, or keywords..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <div className="flex items-center text-gray-600 hover:text-blue-600">
                <FaFilter className="mr-1" />
                <span className="text-sm font-medium mr-1">Filters</span>
                {appliedFilters > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {appliedFilters}
                  </span>
                )}
                <FaChevronDown
                  className={`ml-1 transform transition-transform ${
                    showFilters ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Search buttons */}
          <div className="flex gap-3">
            {/* AI Search button */}
            <button
              type="button"
              onClick={handleAiSearch}
              className={`flex items-center justify-center px-4 py-3 rounded-lg transition-colors ${
                isAiSearching || !searchTerm.trim()
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              } min-w-[140px]`}
            >
              {isAiSearching ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FaRobot className="mr-2" />
                  <span className="font-medium">Search with AI</span>
                </>
              )}
            </button>

            {/* Regular Search button */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center"
            >
              <FaSearch className="mr-2" /> Search
            </button>
          </div>
        </div>

        {/* Advanced filters panel */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-fadeIn mt-3">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700">Advanced Filters</h3>
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <FaTimes className="mr-1" /> Reset filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Product filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <select
                  value={filters.product}
                  onChange={(e) => updateFilter('product', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Products</option>
                  <option value="dapa">Account Production Advance </option>
                  <option value="cosec">COsec</option>
                  <option value="Practice Management">
                    Practice Management
                  </option>
                  <option value="DVO">DVO</option>
                  <option value="UserPortal">UserPortal</option>
                  <option value="Virtual office">Virtual office</option>
                </select>
              </div>

              {/* Bug Type filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bug Type
                </label>
                <select
                  value={filters.bugType}
                  onChange={(e) => updateFilter('bugType', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="template">Template</option>
                  <option value="software">Software</option>
                  <option value="license">License</option>
                  <option value="ui">UI/UX</option>
                  <option value="performance">Performance</option>
                  <option value="Integration">Integration</option>
                  <option value="Data Base Issue">Data Base Issue</option>
                </select>
              </div>

              {/* Status filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => updateFilter('status', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any Status</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Severity filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity
                </label>
                <select
                  value={filters.severity}
                  onChange={(e) => updateFilter('severity', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any Severity</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* Assignee filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignee
                </label>
                <select
                  value={filters.assignee}
                  onChange={(e) => updateFilter('assignee', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any Assignee</option>
                  <option value="unassigned">Unassigned</option>
                  <option value="me">Assigned to me</option>
                  <option value="team">My Team</option>
                </select>
              </div>

              {/* Date Range filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => updateFilter('dateRange', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default BugSearchBar;
