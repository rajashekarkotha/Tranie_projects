import { createSlice, isAction, type PayloadAction } from "@reduxjs/toolkit";
import type { Txn } from "../models/Txn";

interface TxnState {
  txns: Txn[];
  selectedTxn?: Txn;
}

const initialState: TxnState = {
  txns: [
    {
      "id": 1,
      "header": "Salary",
      "txnDate": "2026-01-01",
      "txnType": "CREDIT",
      "amount": 56000
    },
    {
      "id": 2,
      "header": "Rent",
      "txnDate": "2026-01-01",
      "txnType": "DEBIT",
      "amount": 6000
    },
    {
      "id": 3,
      "header": "Fuel",
      "txnDate": "2026-01-01",
      "txnType": "DEBIT",
      "amount": 1025
    },
    {
      "id": 5,
      "header": "Salary",
      "txnDate": "2026-02-12",
      "txnType": "CREDIT",
      "amount": 60000
    },
    {
      "id": 6,
      "header": "Rent",
      "txnDate": "2026-02-12",
      "txnType": "DEBIT",
      "amount": 7000
    },
    {
      "id": 7,
      "header": "educations",
      "txnDate": "2026-03-30",
      "txnType": "DEBIT",
      "amount": 90
    },
    {
      "id": 8,
      "header": "rr",
      "txnDate": "2026-03-31",
      "txnType": "CREDIT",
      "amount": 455
    },
    {
      "id": 9,
      "header": "yui",
      "txnDate": "2026-03-31",
      "txnType": "CREDIT",
      "amount": 55
    }
  ]
};

const TxnSlice = createSlice({
  name: "TxnSlice",
  initialState,
  reducers: {
    addTxn: (state, action: PayloadAction<Txn>) => {
      state.txns.push(action.payload)
    },
    updateTxn: (state, action: PayloadAction<Txn>) => {
      const txn = state.txns.find(txn => txn.id === action.payload.id);
        if (txn) {
          Object.assign(txn, {
            ...action.payload,
            isEditable: false
          });
        }
    },
    editTxn: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.txns = state.txns.map(txn => ({
        ...txn,
        isEditable: txn.id === id
      }));
    },
    removeTxn: (state, action: PayloadAction<Number>) => {
      let index = state.txns.findIndex(cx => cx.id === action.payload);
      if (index) {
        state.txns.splice(index, 1);
      }
    },
    selectTxn: (state, action: PayloadAction<Number>) => {
      state.selectedTxn = state.txns.find(cx => cx.id === action.payload);
    }
  }
});

const TxnReducer = TxnSlice.reducer;

export const { addTxn, updateTxn, removeTxn, selectTxn, editTxn } = TxnSlice.actions;
export default TxnReducer;