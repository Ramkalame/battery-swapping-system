import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellUnits } from '../../../Redux/Features/getAllSellUnits';
import { MaterialReactTable } from 'material-react-table';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#fff',
    },
  },
});

const SellUnits = () => {
  const dispatch = useDispatch();
  const { loading, data, sellUnitsCount, error } = useSelector((state) => state.sellUnits);
  
  useEffect(() => {
    dispatch(fetchSellUnits());
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Mobile',
        accessorKey: 'mobile',
      },
      {
        header: 'Units',
        accessorKey: 'units',
      },
      {
        header: 'Status',
        accessorKey: 'status',
      },
    ],
    []
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> 
      <div style={{ padding: '20px', color: 'white' }}>
        <h2>Sell Units Data</h2>

       

        {data.length>0 ? 
         ( <>
            <p>Total Sell Units: {sellUnitsCount}</p>
            <MaterialReactTable
              columns={columns}
              data={data}
              enableSorting
              enableGlobalFilter
              enablePagination
              muiTableBodyRowProps={{
                hover: true,
              }}
              muiTablePaperProps={{
                elevation: 3,
                sx: { backgroundColor: '#1e1e1e', color: 'white' },
              }}
              muiTableHeadCellProps={{
                sx: { color: '#fff' }, 
              }}
              muiTableBodyCellProps={{
                sx: { color: '#fff' }, 
              }}
            />
          </>): (
          <p style={{ color: 'white' }}>No Seller available.</p>
        )
        }
      </div>
    </ThemeProvider>
  );
};

export default SellUnits;
