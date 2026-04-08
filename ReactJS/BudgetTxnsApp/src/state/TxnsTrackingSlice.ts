import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CustomersData } from "../models/CustomersData";
import type { TxnSummary } from "../models/txnSummary";
import axios from "axios";


interface DeleteTxnPayload {
  accountId: number;
  txnId: number;
}


interface TxnsState {
    Txns: TxnSummary [],
    inProgress?: boolean;
    errMsg?: string;
}

const initialState: TxnsState = {
    Txns: []
};

const apiUrl = "http://localhost:9999";

export const loadTxns = createAsyncThunk<TxnSummary[], {id: string}>(
    "BudgetTrackingSlice/loadTxns",
  async ({id}) => {
     let data: TxnSummary[] = [];
    try {
       const txnsi = (await axios.get(apiUrl+"/Txns")).data;
       data = txnsi.filter((txn:TxnSummary)=>txn.accountId === id);
    } catch (error) {
      throw new Error('Failed to fetch Txns data');
    }
    return data;
  }
)


// export const deleteTxn = createAsyncThunk<
//   { accountId: string; txnId: number },   
//   DeleteTxnPayload                     
// >(
//   "BudgetTrackingSlice/deleteTxn",
//   async ({ accountId, txnId }, { rejectWithValue }) => {
//    console.log(accountId, txnId);
//     try {
//       await axios.delete(`${apiUrl}/txns/${txnId}`);
      
//     //   Return only what reducer needs to update state
//       return { accountId, txnId };
//     } catch (error) {
//       return rejectWithValue("Failed to delete transaction");
//     }
//   }
// );

const TxnsTrackingSlice = createSlice({
    name: "TxnsTrackingSlice",
    initialState,
    reducers: {
        selectedTxns: (state, action: PayloadAction<Number>) => {
            // state.selectedContact = state.contacts.find(cx => cx.id === action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadTxns.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(loadTxns.fulfilled, (state, action: PayloadAction<TxnSummary[]>) => {
                state.inProgress = false;
                state.Txns = action.payload;
            })
            .addCase(loadTxns.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
            // .addCase(deleteTxn.pending, (state) => {
            //     state.inProgress = true;
            //     state.errMsg = undefined;
            // })
            // .addCase(deleteTxn.fulfilled, (state, action: PayloadAction<{ accountId: string; txnId: number }>) => {
            //     state.inProgress = false;
            //     const { accountId, txnId } = action.payload;
            //        state.Txns = state.Txns.filter(
            //          txn =>
            //            !(
            //              txn.accountId === action.payload.accountId &&
            //              txn.id === action.payload.txnId
            //            )
            //        );
            // })
            // .addCase(deleteTxn.rejected, (state, action) => {
            //     state.inProgress = false;
            //     state.errMsg = action.error.message || 'An error occurred';
            // })
    }
});

const TxnsTrackingReducer = TxnsTrackingSlice.reducer;
export default TxnsTrackingReducer;

export const { selectedTxns } = TxnsTrackingSlice.actions;