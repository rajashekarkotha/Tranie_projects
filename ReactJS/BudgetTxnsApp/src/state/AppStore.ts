import { configureStore } from "@reduxjs/toolkit";
import BudgetTrackingReducer from "./BudgetTrackingSlice";
import AccountTrackingReducer from "./AccountTrackingSlice";
import TxnsTrackingReducer from './TxnsTrackingSlice';

export const appStore = configureStore({
    reducer : {
        budgetTrackingSlice : BudgetTrackingReducer,
        accountTrackingReducer : AccountTrackingReducer,
        txnsTrackingSlice : TxnsTrackingReducer
    }
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;