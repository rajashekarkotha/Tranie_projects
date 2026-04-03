import { configureStore } from "@reduxjs/toolkit";
import BudgetTrackingReducer from "./BudgetTrackingSlice";

export const appStore = configureStore({
    reducer : {
        budgetTrackingSlice : BudgetTrackingReducer
    }
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;