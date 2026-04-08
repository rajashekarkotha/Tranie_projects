import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { CustomersData } from "../models/CustomersData";
import type { TxnSummary } from "../models/txnSummary";
import axios from "axios";
interface DeleteTxnPayload {
  accountId: string;
  txnId: number;
}

interface TxnsState {
  Txns: TxnSummary[];
  inProgress?: boolean;
  errMsg?: string;
}

const initialState: TxnsState = {
  Txns: [],
};

const apiUrl = "http://localhost:9999";

export const loadTxns = createAsyncThunk<TxnSummary[], { id: string }>(
  "BudgetTrackingSlice/loadTxns",
  async ({ id }) => {
    let data: TxnSummary[] = [];
    try {
      const txnsi = (await axios.get(apiUrl + "/Txns")).data;
      data = txnsi.filter((txn: TxnSummary) => txn.accountId === id);
      console.log(data, "data");
    } catch (error) {
      throw new Error("Failed to fetch Txns data");
    }
    return data;
  },
);

export const addTxn = createAsyncThunk<
  {
    accountId: string;
    txn: TxnSummary;
  },
  {
    accountId: string;
    data: TxnSummary;
  }
>(
  "BudgetTrackingSlice/addTxn",
  async ({ accountId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/Txns`, {
        ...data,
        accountId,
      });

      return {
        accountId,
        txn: response.data,
      };
    } catch (error) {
      return rejectWithValue("Failed to add transaction");
    }
  },
);

export const deleteTxn = createAsyncThunk<
  { accountId: string; txnId: number },
  { accountId: string; txnId: number }
>(
  "BudgetTrackingSlice/deleteTxn",
  async ({ accountId, txnId }, { rejectWithValue }) => {
    try {
      console.log("Deleting txn:", accountId, txnId);

      // ✅ Correct resource name
      await axios.delete(`${apiUrl}/Txns/${txnId}`);

      return { accountId, txnId };
    } catch (error) {
      return rejectWithValue("Failed to delete transaction");
    }
  },
);

// export const updateTxn = createAsyncThunk<
//   { accountId: string; txn: TxnSummary }, // ✅ fulfilled payload
//   { accountId: string; txnId: number; data: TxnSummary } // ✅ dispatch payload
// >(
//   "BudgetTrackingSlice/updateTxn",
//   async ({ accountId, txnId, data }, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(`${apiUrl}/Txns/${txnId}`, data);
//       return { accountId, txn: response.data };
//     } catch (error) {
//       return rejectWithValue("Failed to update transaction");
//     }
//   },
// );

export const updateTxn = createAsyncThunk<
  {
    accountId: string;
    oldTxn: TxnSummary;
    updatedTxn: TxnSummary;
  },
  {
    accountId: string;
    txnId: number;
    data: TxnSummary;
  }
>(
  "BudgetTrackingSlice/updateTxn",
  async ({ accountId, txnId, data }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;

      const oldTxn = state.txnsTrackingSlice.Txns.find(
        (t: TxnSummary) => t.id === txnId,
      );

      if (!oldTxn) throw new Error("Old txn not found");

      const response = await axios.put(
        `http://localhost:9999/Txns/${txnId}`,
        data,
      );

      return {
        accountId,
        oldTxn,
        updatedTxn: response.data,
      };
    } catch (e) {
      return rejectWithValue("Failed to update transaction");
    }
  },
);

const TxnsTrackingSlice = createSlice({
  name: "TxnsTrackingSlice",
  initialState,
  reducers: {
    selectedTxns: (state, action: PayloadAction<Number>) => {
      // state.selectedContact = state.contacts.find(cx => cx.id === action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTxns.pending, (state) => {
        state.inProgress = true;
        state.errMsg = undefined;
      })
      .addCase(
        loadTxns.fulfilled,
        (state, action: PayloadAction<TxnSummary[]>) => {
          state.inProgress = false;
          state.Txns = action.payload;
        },
      )
      .addCase(loadTxns.rejected, (state, action) => {
        state.inProgress = false;
        state.errMsg = action.error.message || "An error occurred";
      })
      .addCase(deleteTxn.pending, (state) => {
        state.inProgress = true;
        state.errMsg = undefined;
      })
      .addCase(
        deleteTxn.fulfilled,
        (
          state,
          action: PayloadAction<{ accountId: string; txnId: number }>,
        ) => {
          state.inProgress = false;
          console.log(action.payload);
          const { txnId } = action.payload;
          console.log("Reducer received txnId:", txnId, typeof txnId);
          console.log(
            "Before delete:",
            state.Txns.map((txn) => ({ ...txn })),
          );
          state.Txns = state.Txns.filter(
            (txn) => Number(txn.id) !== Number(txnId),
          );
          console.log("After delete:", state.Txns);
        },
      )
      .addCase(deleteTxn.rejected, (state, action) => {
        state.inProgress = false;
        state.errMsg = action.error.message || "An error occurred";
      })
      .addCase(updateTxn.pending, (state) => {
        state.inProgress = true;
        state.errMsg = undefined;
      })
      //   .addCase(
      //     updateTxn.fulfilled,
      //     (
      //       state,
      //       action: PayloadAction<{ accountId: string; txn: TxnSummary }>,
      //     ) => {
      //       state.inProgress = false;
      //       const updatedTxn = action.payload.txn;
      //       const index = state.Txns.findIndex(
      //         (txn) => Number(txn.id) === Number(updatedTxn.id),
      //       );
      //       if (index !== -1) {
      //         state.Txns[index] = updatedTxn;
      //       }
      //     },
      //   )
      .addCase(
        updateTxn.fulfilled,
        (
          state,
          action: PayloadAction<{
            accountId: string;
            oldTxn: TxnSummary;
            updatedTxn: TxnSummary;
          }>,
        ) => {
          state.inProgress = false;

          const { updatedTxn } = action.payload;

          const index = state.Txns.findIndex(
            (txn) => Number(txn.id) === Number(updatedTxn.id),
          );

          if (index !== -1) {
            state.Txns[index] = updatedTxn; // ✅ safe with Immer
          }
        },
      )
      .addCase(updateTxn.rejected, (state, action) => {
        state.inProgress = false;
        state.errMsg = action.error.message || "Update failed";
      })
      .addCase(addTxn.pending, (state) => {
        state.inProgress = true;
        state.errMsg = undefined;
      })
      .addCase(
        addTxn.fulfilled,
        (
          state,
          action: PayloadAction<{
            accountId: string;
            txn: TxnSummary;
          }>,
        ) => {
          state.inProgress = false;

          // ✅ Add txn to current account txns
          state.Txns.push(action.payload.txn);
        },
      )
      .addCase(addTxn.rejected, (state, action) => {
        state.inProgress = false;
        state.errMsg = action.error.message || "Add failed";
      });
  },
});

const TxnsTrackingReducer = TxnsTrackingSlice.reducer;
export default TxnsTrackingReducer;

export const { selectedTxns } = TxnsTrackingSlice.actions;
