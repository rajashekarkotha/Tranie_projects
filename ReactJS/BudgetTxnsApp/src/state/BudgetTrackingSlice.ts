import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CustomersData } from "../models/CustomersData";
import type { AccountSummary } from "../models/accountSummary";
import type { TxnSummary } from "../models/txnSummary";
import axios from "axios";

interface CustomerSummaryState {
    customerSummary: CustomersData[];
    selectedCustomerSummary?: CustomersData;
    accounts: AccountSummary[],
    // Txns: TxnSummary [],
    selectedAccount?: AccountSummary; 
    inProgress?: boolean;
    errMsg?: string;
}

const initialState: CustomerSummaryState = {
    customerSummary: [],
    accounts: [],
};

const apiUrl = "http://localhost:9999";

export const loadCustomers = createAsyncThunk<CustomersData[], void>(
    'BudgetTrackingSlice/loadCustomers',
    async () => {
        let data: CustomersData[] = [];
        try {
            data = (await axios.get(apiUrl+"/customerSummary")).data;
        } catch (err) {
            throw new Error('Failed to fetch customerSummary data');
        }
        return data;
    }
);

export const loadAccounts = createAsyncThunk<
  AccountSummary[], void
>(
  "BudgetTrackingSlice/loadAccounts",
  async () => {
     let data: AccountSummary[] = [];
    try {
       data = (await axios.get(apiUrl+"/accounts")).data;
    } catch (error) {
      throw new Error('Failed to fetch accounts data');
    }
    return data;
  }
);





const BudgetTrackingSlice = createSlice({
    name: "BudgetTrackingSlice",
    initialState,
    reducers: {
        selectContact: (state, action: PayloadAction<Number>) => {
            // state.selectedContact = state.contacts.find(cx => cx.id === action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadCustomers.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(loadCustomers.fulfilled, (state, action: PayloadAction<CustomersData[]>) => {
                state.inProgress = false;
                state.customerSummary = action.payload;
            })
            .addCase(loadCustomers.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
            .addCase(loadAccounts.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(loadAccounts.fulfilled, (state, action: PayloadAction<AccountSummary[]>) => {
                state.inProgress = false;
                state.accounts = action.payload;
            })
            .addCase(loadAccounts.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
    }
});

const BudgetTrackingReducer = BudgetTrackingSlice.reducer;
export default BudgetTrackingReducer;

export const { selectContact } = BudgetTrackingSlice.actions;