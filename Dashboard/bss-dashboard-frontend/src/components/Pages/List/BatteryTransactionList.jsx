import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBatteryTransactions } from '../../../Redux/Features/getBatteryTransactionsSlice';
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

const BatteryTransactionList = () => {
  const dispatch = useDispatch();
  const { loading, transactions, error } = useSelector(
    (state) => state.batteryTransactions
  );

  useEffect(() => {
    dispatch(fetchBatteryTransactions());
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        header: 'Serial Number',
        accessorKey: 'serialNumber',
      },
      {
        header: 'User Name',
        accessorKey: 'userName',
      },
      {
        header: 'Vehicle Number',
        accessorKey: 'vehicleNumber',
      },
      {
        header: 'Timestamp',
        accessorKey: 'timeStamp',
        Cell: ({ cell }) => {
          const timestamp = cell.row.original.timeStamp;
      
          try {
            let date;
      
            // Check if timestamp is an object with _seconds and _nanoseconds
            if (timestamp && typeof timestamp === 'object' && '_seconds' in timestamp) {
              // Convert Firebase-style timestamp to milliseconds
              date = new Date(timestamp._seconds * 1000);
            } else if (typeof timestamp === 'string') {
              // Handle ISO string format
              date = new Date(timestamp);
            } else {
              throw new Error('Unsupported timestamp format');
            }
      
            if (isNaN(date.getTime())) {
              throw new Error('Invalid date');
            }
      
            // Format the date into a readable string without timezone
            const formattedDate = date.toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true, // Ensures AM/PM format
            });
      
            return <span>{formattedDate}</span>;
          } catch (error) {
            console.error('Invalid timestamp format:', timestamp, error);
            return <span>Invalid Date</span>;
          }
        },
      },      
      {
        header: 'Number of Transactions',
        accessorKey: 'noOfTransaction',
      },
      {
        header: 'Swapping Cost (₹)',
        accessorKey: 'swappingCost',
      },
    ],
    []
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div style={{ padding: '20px', color: 'white' }}>
        <h2>Battery Transactions</h2>

        {loading && <p>Loading transactions...</p>}

        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {transactions.length > 0 ? (
          <MaterialReactTable
            columns={columns}
            data={transactions}
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
        ) : (
          <p>No transactions available.</p>
        )}
      </div>
    </ThemeProvider>
  );
};

export default BatteryTransactionList;
