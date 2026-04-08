import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { CustomersData } from "../models/CustomersData";
import type { AccountSummary } from "../models/accountSummary";
import type { TxnSummary } from "../models/txnSummary";
import axios from "axios";
import { updateTxn } from "./TxnsTrackingSlice";

interface AccountSummaryState {
  accounts: AccountSummary[];
  accountSummary: AccountSummary[];
  selectedAccountSummary?: AccountSummary;
  inProgress?: boolean;
  errMsg?: string;
}

const initialState: AccountSummaryState = {
  accountSummary: [],
  accounts: [],
};

const apiUrl = "http://localhost:9999";

export const loadAccounts = createAsyncThunk<AccountSummary[], void>(
  "BudgetTrackingSlice/loadAccounts",
  async () => {
    let data: AccountSummary[] = [];
    try {
      data = (await axios.get(apiUrl + "/accounts")).data;
    } catch (error) {
      throw new Error("Failed to fetch accounts data");
    }
    return data;
  },
);

const AccountTrackingSlice = createSlice({
  name: "AccountTrackingSlice",
  initialState,
  reducers: {
    selectedAccount: (state, action: PayloadAction<Number>) => {
      // state.selectedContact = state.contacts.find(cx => cx.id === action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAccounts.pending, (state) => {
        state.inProgress = true;
        state.errMsg = undefined;
      })
      .addCase(
        loadAccounts.fulfilled,
        (state, action: PayloadAction<AccountSummary[]>) => {
          state.inProgress = false;
          state.accounts = action.payload;
        },
      )
      .addCase(loadAccounts.rejected, (state, action) => {
        state.inProgress = false;
        state.errMsg = action.error.message || "An error occurred";
      })
    //   .addCase(
    //     updateTxn.fulfilled,
    //     (
    //       state,
    //       action: PayloadAction<{
    //         accountId: string;
    //         oldTxn: TxnSummary;
    //         updatedTxn: TxnSummary;
    //       }>,
    //     ) => {
    //       const { accountId, oldTxn, updatedTxn } = action.payload;

    //       const account = state.accounts.find(
    //         (acc) => acc.accountId === accountId,
    //       );
    //       if (!account) return;

    //       // 🔁 reverse old effect
    //       if (oldTxn.txnType === "CREDIT") {
    //         account.summary.totalCredit -= oldTxn.amount;
    //         account.summary.balance -= oldTxn.amount;
    //       } else {
    //         account.summary.totalDebit -= oldTxn.amount;
    //         account.summary.balance += oldTxn.amount;
    //       }

    //       // ➕ apply new effect
    //       if (updatedTxn.txnType === "CREDIT") {
    //         account.summary.totalCredit += updatedTxn.amount;
    //         account.summary.balance += updatedTxn.amount;
    //       } else {
    //         account.summary.totalDebit += updatedTxn.amount;
    //         account.summary.balance -= updatedTxn.amount;
    //       }
    //       console.log(state.accounts);
    //     },
    //   );
    //   .addCase(updateTxn.fulfilled, (state, action: PayloadAction<{accountId: string;oldTxn: TxnSummary; updatedTxn: TxnSummary;}>) => {
    //       state.inProgress = false;
    //       const { accountId, oldTxn, updatedTxn } = action.payload;
    //       console.log('updatedTxn',updatedTxn);
    //       const account = state.accounts.find(
    //         (acc) => acc.accountId === accountId,
    //       );
    //       if (!account || !oldTxn) return;

    //       // ✅ 1. Reverse old transaction impact
    //       if (oldTxn.txnType === "CREDIT") {
    //         account.summary.totalCredit -= oldTxn.amount;
    //         account.summary.balance -= oldTxn.amount;
    //       } else {
    //         account.summary.totalDebit -= oldTxn.amount;
    //         account.summary.balance += oldTxn.amount;
    //       }

    //       // ✅ 2. Apply updated transaction impact
    //       if (updatedTxn.txnType === "CREDIT") {
    //         account.summary.totalCredit += updatedTxn.amount;
    //         account.summary.balance += updatedTxn.amount;
    //       } else {
    //         account.summary.totalDebit += updatedTxn.amount;
    //         account.summary.balance -= updatedTxn.amount;
    //       }
    //     },
    //   )
    //   .addCase(deleteTxn.fulfilled, (state, action: PayloadAction<{ accountId: string; txn: TxnSummary }>) => {
    //     const { accountId, txn } = action.payload;

    //     const account = state.accountSummary.find(
    //       a => a.accountId === accountId
    //     );

    //    if (!account) return;
    //    if (txn.txnType === "CREDIT") {
    //      account?.summary?.totalCredit -= txn.amount;
    //      account?.summary?.balance -= txn.amount;
    //    } else {
    //      account?.summary?.totalDebit -= txn.amount;
    //      account?.summary?.balance += txn.amount;
    //    }
    // })
  },
});

const AccountTrackingReducer = AccountTrackingSlice.reducer;
export default AccountTrackingReducer;

export const { selectedAccount } = AccountTrackingSlice.actions;
