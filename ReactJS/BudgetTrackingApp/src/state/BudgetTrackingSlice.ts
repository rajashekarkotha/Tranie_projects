import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CustomersData } from "../models/CustomersData";
import type { AccountSummary } from "../models/accountSummary";
import type { TxnSummary } from "../models/txnSummary";
import axios from "axios";


interface CustomerSummaryState {
    customerSummary: CustomersData[];
    selectedCustomerSummary?: CustomersData;
    selectedAccount?: AccountSummary; 
    inProgress?: boolean;
    errMsg?: string;
}

const initialState: CustomerSummaryState = {
    customerSummary: []
};

const apiUrl = "http://localhost:9999";

export const addCustomer = createAsyncThunk<
  CustomersData,
  Omit<CustomersData, "customerId" | "createdAt" | "accounts">,
  { rejectValue: string }
>(
  "BudgetTrackingSlice/addCustomer",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/customers`, data);
      console.log("Response from addCustomer API: ", response.data);
      return response.data as CustomersData;
    } catch (error) {
      return rejectWithValue("Failed to add customer");
    } 
  }
);

export const addBankAccount = createAsyncThunk<
  any,
  { customerId: string; data:any},
  { rejectValue: string }
>(
  "BudgetTrackingSlice/addBankAccount",
  async ({ customerId, data }, { rejectWithValue }) => {  
    try {      
      const response = await axios.post(`${apiUrl}/customers/${customerId}/accounts`, data);
      return response.data as AccountSummary;
    } catch (error) {
      return rejectWithValue("Failed to add bank account");
    }
  }
);

export const loadCustomers = createAsyncThunk<CustomersData[], void>(
    'BudgetTrackingSlice/loadCustomers',
    async () => {
        let data: CustomersData[] = [];
        try {
            data = (await axios.get(apiUrl+"/customerSummary")).data;
        } catch (err) {
            throw new Error('Failed to fetch data');
        }
        return data;
    }
);

export const loadAccount = createAsyncThunk<
  AccountSummary,
  string,
  { rejectValue: string }
>(
  "BudgetTrackingSlice/loadAccount",
  async (accountId, { rejectWithValue }) => {
    try {
      const response = await axios.get(apiUrl+`/accounts/${accountId}`);

      return response.data as AccountSummary;
    } catch (error) {
      return rejectWithValue("Failed to fetch account transactions");
    }
  }
);

// export const loadAccounSummary = createAsyncThunk<AccountSummary[], void>(
//     'BudgetTrackingSlice/loadTxnWithAccount',
//     async () => {   
//         let data: AccountSummary[] = [];
//         try {
//             data = (await axios.get(apiUrl + "/txnWithAccount")).data;
//             console.log(" ", data);
//         } catch (err) {
//             throw new Error('Failed to fetch data');
//         } 
//           return data;
//     }
// );

export const addTxn = createAsyncThunk<
  AccountSummary,
  { accountId: string; data: Omit<TxnSummary, "id"> },
  { rejectValue: string }
>(
  "BudgetTrackingSlice/addTxn",
  async ({ accountId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/accounts/${accountId}/txns`,
        data
      );
      return response.data as AccountSummary;
    } catch (error) {
      return rejectWithValue("Failed to add transaction");
    }
  }
);

export const updateTxn = createAsyncThunk<
  AccountSummary,
  { accountId: string; txnId: number; data: Partial<TxnSummary> },
  { rejectValue: string }
>(
  "BudgetTrackingSlice/updateTxn",
  async ({ accountId, txnId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/accounts/${accountId}/txns/${txnId}`,
        data
      );
      return response.data as AccountSummary;
    } catch (error) {
      return rejectWithValue("Failed to update transaction");
    }
  }
);

export const deleteTxn = createAsyncThunk<
  AccountSummary,
  { accountId: string; txnId: number },
  { rejectValue: string }
>(
  "BudgetTrackingSlice/deleteTxn",
  async ({ accountId, txnId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/accounts/${accountId}/txns/${txnId}`
      );
      return response.data as AccountSummary;
    } catch {
      return rejectWithValue("Failed to delete transaction");
    }
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
            
        /* -------- Load Account by AccountId -------- */
            .addCase(loadAccount.pending, (state) => {
              state.inProgress = true;
              state.errMsg = undefined;
            })
            .addCase(
              loadAccount.fulfilled,
              (state, action: PayloadAction<AccountSummary>) => {
                state.inProgress = false;
                state.selectedAccount = action.payload;
              }
            )
            .addCase(loadAccount.rejected, (state, action) => {
              state.inProgress = false;
              state.errMsg = action.payload;
            })

            // .addCase(loadTxns.pending, (state) => {
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
            
            .addCase(addTxn.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(addTxn.fulfilled, (state, action: PayloadAction<AccountSummary>) => {
                state.inProgress = false;
                state.selectedAccount = action.payload;
            })
            .addCase(addTxn.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
            .addCase(updateTxn.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(updateTxn.fulfilled, (state, action: PayloadAction<AccountSummary>) => {
                state.inProgress = false;
                state.selectedAccount = action.payload;
                // if (state.selectedAccount) {
                //     state.selectedAccount = {
                //         ...state.selectedAccount,
                //         Txns: state.selectedAccount.Txns?.map((txn) =>
                //             txn.id === action.payload.id ? action.payload : txn
                //         ) ?? [],
                //         summary: {
                //             ...state.selectedAccount.summary,
                //             balance: state.selectedAccount.summary.balance + (action.payload.txnType === "CREDIT" ? action.payload.amount : -action.payload.amount),
                //             totalCredit: state.selectedAccount.summary.totalCredit + (action.payload.txnType === "CREDIT" ? action.payload.amount : 0),
                //             totalDebit: state.selectedAccount.summary.totalDebit + (action.payload.txnType === "DEBIT" ? action.payload.amount : 0)
                //         }
                //     };
                // }
            })
            .addCase(updateTxn.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
            .addCase(deleteTxn.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(deleteTxn.fulfilled, (state, action: PayloadAction<AccountSummary>) => {
                state.inProgress = false;
                state.selectedAccount = action.payload;
            })
            .addCase(deleteTxn.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
            .addCase(addBankAccount.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(addBankAccount.fulfilled, (state, action: PayloadAction<AccountSummary>) => {
                state.inProgress = false;
                if (state.selectedCustomerSummary) {
                    state.selectedCustomerSummary.accounts.push(action.payload);
                }
            })
            .addCase(addBankAccount.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred'; 
            })     
            .addCase(addCustomer.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(addCustomer.fulfilled, (state, action: PayloadAction<CustomersData>) => {
                state.inProgress = false;
                state.customerSummary.push(action.payload);
            })
            .addCase(addCustomer.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.payload || 'An error occurred';
            })
    }
});

const BudgetTrackingReducer = BudgetTrackingSlice.reducer;
export default BudgetTrackingReducer;

export const { selectContact } = BudgetTrackingSlice.actions;