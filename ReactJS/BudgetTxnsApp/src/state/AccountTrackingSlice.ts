import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CustomersData } from "../models/CustomersData";
import type { AccountSummary } from "../models/accountSummary";
import axios from "axios";


interface AccountSummaryState {
    accountSummary: AccountSummary[];
    selectedAccountSummary?: AccountSummary;
    inProgress?: boolean;
    errMsg?: string;
}

const initialState: AccountSummaryState = {
    accountSummary: []
};

const apiUrl = "http://localhost:9999";




const AccountTrackingSlice = createSlice({
    name: "AccountTrackingSlice",
    initialState,
    reducers: {
        selectedAccount: (state, action: PayloadAction<Number>) => {
            // state.selectedContact = state.contacts.find(cx => cx.id === action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            // .addCase(loadCustomers.pending, (state) => {
            //     state.inProgress = true;
            //     state.errMsg = undefined;
            // })
            // .addCase(loadCustomers.fulfilled, (state, action: PayloadAction<CustomersData[]>) => {
            //     state.inProgress = false;
            //     state.customerSummary = action.payload;
            // })
            // .addCase(loadCustomers.rejected, (state, action) => {
            //     state.inProgress = false;
            //     state.errMsg = action.error.message || 'An error occurred';
            // })
    }
});

const AccountTrackingReducer = AccountTrackingSlice.reducer;
export default AccountTrackingReducer;

export const { selectedAccount } = AccountTrackingSlice.actions;