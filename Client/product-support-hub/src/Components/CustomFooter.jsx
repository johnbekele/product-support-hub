import { GridFooterContainer, GridPagination } from '@mui/x-data-grid';
import Button from '@mui/material/Button';

function CustomFooter() {
  return (
    <GridFooterContainer>
      <GridPagination />
      <Button
        variant="contained"
        size="small"
        sx={{ ml: 2 }}
        onClick={() => alert('Export clicked!')}
      >
        Export
      </Button>
    </GridFooterContainer>
  );
}

export default CustomFooter;
