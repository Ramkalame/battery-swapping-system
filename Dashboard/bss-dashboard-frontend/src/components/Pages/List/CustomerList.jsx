import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers } from '../../../Redux/Features/getAllCustomersSlice';
import {MaterialReactTable} from 'material-react-table';
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

const CustomerList = () => {
  const dispatch = useDispatch();
  const { loading, customers, error, customersCount } = useSelector((state) => state.customers);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

 
  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessorKey: 'name', 
      },
      {
        header: 'Role',
        accessorKey: 'role', 
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
        header: 'Vehicle',
        accessorKey: 'vehicle', 
      },
      {
        header: 'Registration Time',
        accessorKey: 'registrationTime', 
        Cell: ({ cell }) => {
          const { _seconds, _nanoseconds } = cell.row.original.registrationTime;
          const secondsInMillis = _seconds * 1000;
          const nanosecondsInMillis = _nanoseconds / 1000000; 
          const registrationDate = new Date(secondsInMillis + nanosecondsInMillis);
          const formattedDate = registrationDate.toLocaleString(); 
          return <span>{formattedDate}</span>;
      },
      },
      {
        header: 'Location',
        accessorKey: 'location', 
        Cell: ({ cell }) => (
          <span>
            {cell.row.original.location._latitude},{' '}
            {cell.row.original.location._longitude}
          </span>
        ), 
      },
      {
        header: 'Last Updated',
        accessorKey: 'lastUpdated', 
        Cell: ({ cell }) => (
          <span>
            {new Date(cell.row.original.lastUpdated._seconds * 1000).toLocaleString()}
          </span>
        ), 
      },
    ],
    []
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div style={{ padding: '20px', color: 'white' }}>
        <h2>Customer List</h2>

      

        {customers.length > 0 ? (
          <>
            <p>Total Customers: {customersCount}</p>
            <MaterialReactTable
              columns={columns}
              data={customers} 
              enableSorting
              enableGlobalFilter
              enablePagination
              muiTableBodyRowProps={{
                hover: true, 
              }}
              muiTablePaperProps={{
                elevation: 3,
                style: { backgroundColor: '#1e1e1e', color: 'white' }, 
              }}
            />
          </>
        ) : (
          <p>No customers available.</p>
        )}
      </div>
    </ThemeProvider>
  );
};

export default CustomerList;
