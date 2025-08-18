import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import CustomFooter from './CustomFooter';

function DataTable({
  rows,
  columns,
  density,
  hideFooterSelectedRowCount,
  onSelectionChange,
  selectedRowsToParent,
  autoHeight,
  disableColumnMenu,
  headerHeight,
}) {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
    selectedRowsToParent(newSelection);
    if (onSelectionChange) {
      const selectedRowsData = rows.filter((row) =>
        newSelection.includes(row.id)
      );
      onSelectionChange(newSelection, selectedRowsData);
    }
  };

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });

  const paperStyles = {
    height: autoHeight ? 'auto' : 700,
    width: '100%',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
  };

  const dataGridStyles = {
    border: 0,
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: '#f5f5f5',
      color: '#000',
      fontWeight: 600,
      fontSize: '0.875rem',
      borderBottom: '2px solid #e0e0e0',
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 600,
      color: '#000',
    },
    '& .MuiDataGrid-cell': {
      borderBottom: '1px solid #f0f0f0',
    },
    '& .MuiDataGrid-footerContainer': {
      backgroundColor: '#f5f5f5',
      borderTop: '1px solid #ddd',
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  };

  return (
    <Paper sx={paperStyles}>
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={dataGridStyles}
        rowSelectionModel={selectedRows}
        onRowSelectionModelChange={handleSelectionChange}
        hideFooterSelectedRowCount={hideFooterSelectedRowCount}
        density={density || 'standard'}
        slots={{ footer: CustomFooter }}
        autoHeight={autoHeight}
        disableColumnMenu={disableColumnMenu}
        columnHeaderHeight={headerHeight || 56}
      />
    </Paper>
  );
}

export default DataTable;