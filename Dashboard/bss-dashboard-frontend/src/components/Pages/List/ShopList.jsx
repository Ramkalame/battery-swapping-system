import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShops } from '../../../Redux/Features/getAllShopsSlice';
import CustomerList from './CustomerList';
import SellUnits from './SellList';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import {MaterialReactTable} from 'material-react-table';


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

const ShopList = () => {
  const dispatch = useDispatch();
  const { loading, shops, error, count } = useSelector((state) => state.shops);

  useEffect(() => {
    dispatch(fetchShops());
  }, [dispatch]);


  const columns = useMemo(
    () => [
      {
        header: 'Shop Name',
        accessorKey: 'shopName',
      },
      {
        header: 'Name',
        accessorKey: 'name', 
      },
      {
        header: 'Address',
        accessorKey: 'address',
      },
      {
        header: 'Mobile',
        accessorKey: 'mobile', 
      },
      {
        header: 'Email',
        accessorKey: 'email', 
      },
      {
        header: 'Location',
        accessorKey: 'location', 
        Cell: ({ cell }) => (
          <span>
            {cell.row.original.location.latitude},{' '}
            {cell.row.original.location.longitude}
          </span>
        ), 
      },
    ],
    []
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div style={{ padding: '20px' }}>
        <h2 style={{ color: 'white' }}>Shop List</h2>

        

        {shops.length > 0 ? (
          <>
            <p style={{ color: 'white' }}>Total Shops: {count}</p>
            <MaterialReactTable
              columns={columns}
              data={shops}
              enableSorting
              enableGlobalFilter
              enablePagination
              muiTableBodyRowProps={{
                hover: true, 
              }}
              muiTablePaperProps={{
                elevation: 3,
                style: { backgroundColor: '#1e1e1e' }, 
              }}
            />
          </>
        ) : (
          <p style={{ color: 'white' }}>No shops available.</p>
        )}

      </div>
    </ThemeProvider>
  );
};

export default ShopList;
