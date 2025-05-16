import React, { useState } from 'react';
import { FaSearch, FaFilter, FaChevronDown, FaTimes } from 'react-icons/fa';

function BugSearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    product: '',
    bugType: '',
    status: '',
    severity: '',
    assignee: '',
    dateRange: 'all',
  });
  const [appliedFilters, setAppliedFilters] = useState(0);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm, 'with filters:', filters);
    // Implement your search logic here
  };

  const updateFilter = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    setFilters({
      product: '',
      bugType: '',
      status: '',
      severity: '',
      assignee: '',
      dateRange: 'all',
    });
  };

  const countAppliedFilters = () => {
    return Object.values(filters).filter(
      (value) => value !== '' && value !== 'all'
    ).length;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      {/* Main search bar */}
      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for bugs by ID, title, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Filters section */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-fadeIn">
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
                  <option value="dapa">DAPA</option>
                  <option value="cosec">COsec</option>
                  <option value="dpm">DPM</option>
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
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
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
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
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

        {/* Search button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors flex items-center"
          >
            <FaSearch className="mr-2" /> Search Bugs
          </button>
        </div>
      </form>
    </div>
  );
}

export default BugSearchBar;
