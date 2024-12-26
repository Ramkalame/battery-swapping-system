import { configureStore } from "@reduxjs/toolkit";
import shopSlice from "../Features/getAllShopsSlice";
import customerSlice from "../Features/getAllCustomersSlice";
import sellUnitsSlice from "../Features/getAllSellUnits";
// import liveSellUnitSlice from "../Features/getLiveSellUnitSlice";
import batteryTransactionsSlice from '../Features/getBatteryTransactionsSlice'; // Import the new slice


const store = configureStore({
  reducer: {
    shops: shopSlice,
    customers:customerSlice,
    sellUnits:sellUnitsSlice,
    batteryTransactions: batteryTransactionsSlice, // Add the new slice

    // liveSellUnit:liveSellUnitSlice
  },
});

export default store;
