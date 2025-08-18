import React, { useState } from 'react';
import DataTable from '../../Components/DataTable.jsx';
import { useMediaQuery } from '@mui/material';
import { useLogger } from '../../Hook/useLogger.js';
import { useWiki } from '../../Hook/useWiki.js';
import SplitButton from '../../Components/SplitButton.jsx';
import axios from 'axios';


function WikiManagementPage() {
  const logger = useLogger();
  const { wikiData, isLoading, isError, error } = useWiki();

  const isMobile = useMediaQuery('(max-width:768px)');

  const handleRowSelectionChange = (selectedRows) => {
    logger.log('Selected rows:', selectedRows);
  };

   const options = [
    { value: 'post_Dsite', label: 'Post to DSite ' },
    { value: 'post_wiki', label: 'Post to Wiki ' },
    

    { value: 'confirm', label: 'Confirm founding ' },
  ];


    const handleDecision = (selectedOption, row) => {
    switch (selectedOption) {
      case 'post_wiki':
        console.log("post to wiki ")
        break;
      case 'post_Dsite':
        console.log("post to Dsite ")
        break;
      case 'confirm':
        console.log("post to COnfim ")
        break;
      default:
        logger.log('Invalid option selected');
        break;
    }
  };

  
  
const columns = [
  { 
    field: 'id', 
    headerName: 'ID', 
    width: 100,
    flex: 0.5,
    minWidth: 80
  },
  {
    field: 'title',
    headerName: 'Title',
    flex: 2,
    minWidth: 250,
    renderCell: (params) => (
      <span title={params.value}>
        {params.value}
      </span>
    ),
  },
  {
    field: 'found',
    headerName: 'Status',
    flex: 0.5,
    minWidth: 100,
    renderCell: (params) => (
      <span className={params.value ? 'text-green-500' : 'text-red-500'}>
        {params.value ? 'Found' : 'Not Found'}
      </span>
    ),
  },
  {
    field: 'resolution',
    headerName: 'Resolution',
    flex: 3,
    minWidth: 300,
    renderCell: (params) => (
      <span title={params.value}>
        {params.value?.substring(0, 100)}
        {params.value?.length > 100 ? '...' : ''}
      </span>
    ),
  },
  {
    field: 'createdAt',
    headerName: 'Created Date',
    flex: 1,
    minWidth: 120,
    renderCell: (params) => (
      <span>
        {new Date(params.value).toLocaleDateString()}
      </span>
    ),
  },
 { field:"decision",
   headerName:"Decision",
   flex:1,
   minWidth:120,
   renderCell:(params)=>params.value,
 }

];

  // Transform wiki data to rows format
  const rows = wikiData
    ? wikiData.map((item) => ({
        id: item._id,
        title: item.title,
        found: item.found,
        resolution: item.resolution,
        createdAt: item.createdAt,
         decision: (
          <SplitButton
            options={options}
            handleDecision={(selectedOption) =>
              handleDecision(selectedOption, item)
            }
          />
        ),
      }))
    : [];

  return (
    <div className="flex flex-col p-2 sm:p-4 md:p-6 w-full mt-10 md:mt-1">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Wiki Knowledge Base
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Browse and manage wiki entries
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40 md:h-64">
          <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 md:px-4 md:py-3 rounded relative text-sm md:text-base">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline">
            {error?.message || 'Failed to load wiki data'}
          </span>
        </div>
      ) : wikiData && wikiData.length > 0 ? (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="w-full overflow-auto">
            <DataTable
  rows={rows}
  columns={columns}
  density={isMobile ? 'compact' : 'standard'}
  selectedRowsToParent={handleRowSelectionChange}
  hideFooterSelectedRowCount={isMobile}
  autoHeight={true}
  disableColumnMenu={false}
  headerHeight={56}
/>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-6 md:px-4 md:py-10 rounded text-center">
          <svg
            className="mx-auto h-8 w-8 md:h-12 md:w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-xs md:text-sm font-medium text-gray-900">
            No wiki entries
          </h3>
          <p className="mt-1 text-xs md:text-sm text-gray-500">
            There are currently no wiki entries in the system.
          </p>
        </div>
      )}
    </div>
  );
}

export default WikiManagementPage;