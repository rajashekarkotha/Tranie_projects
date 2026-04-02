import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Txn } from "../models/Txn";
import axios from "axios";

interface txnState {
    txns: Txn[];
    selectedtxn?: Txn;
    inProgress?: boolean;
    errMsg?: string;
}

const initialState: txnState = {
    txns: []
};

const apiUrl = "http://localhost:9999/txns";

export const loadtxns = createAsyncThunk<Txn[], void>(
    'txnsSlice/loadtxns',
    async () => {
        let data: Txn[] = [];
        try {
            data = (await axios.get(apiUrl)).data;
        } catch (err) {
            throw new Error('Failed to fetch data');
        }
        return data;
    }
);

export const addtxn = createAsyncThunk<Txn, Txn>(
    'txnsSlice/addtxn',
    async (txn) => {
        let data: Txn;
        try {
            data = (await axios.post(apiUrl, txn)).data;
        } catch (err) {
            throw new Error('Failed to save');
        }
        return data;
    }
);

export const updatetxn = createAsyncThunk<Txn, Txn>(
    'txnsSlice/updatetxn',
    async (txn) => {
        let data: Txn;
        try {
            data = (await axios.put(apiUrl + "/" + txn.id, txn)).data;
        } catch (err) {
            throw new Error('Failed to save');
        }
        return data;
    }
);

export const deletetxn = createAsyncThunk<Number, Number>(
    'txnsSlice/deletetxn',
    async (id) => {
        try {
            await axios.delete(apiUrl + "/" + id);
        } catch (err) {
            throw new Error('Failed to delete');
        }
        return id;
    }
);

const TxnsSlice = createSlice({
    name: "txnsSlice",
    initialState,
    reducers: {
        selecttxn : (state, action:PayloadAction<Number>) => {
            state.selectedtxn = state.txns.find(cx => cx.id===action.payload);                        
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadtxns.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(loadtxns.fulfilled, (state, action: PayloadAction<Txn[]>) => {
                state.inProgress = false;
                state.txns = action.payload;
            })
            .addCase(loadtxns.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
            .addCase(addtxn.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(addtxn.fulfilled, (state, action: PayloadAction<Txn>) => {
                state.inProgress = false;
                state.txns.push(action.payload);
            })
            .addCase(addtxn.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
            .addCase(updatetxn.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(updatetxn.fulfilled, (state, action: PayloadAction<Txn>) => {
                state.inProgress = false;
                let index = state.txns.findIndex(cx => cx.id === action.payload.id);
                if (index > -1) {
                    state.txns[index] = action.payload;
                }
            })
            .addCase(updatetxn.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
            .addCase(deletetxn.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(deletetxn.fulfilled, (state, action: PayloadAction<Number>) => {
                state.inProgress = false;
                let index = state.txns.findIndex(cx => cx.id === action.payload);
                if (index > -1) {
                    state.txns.splice(index, 1);
                }
            })
            .addCase(deletetxn.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            });
    }
});

const TxnsReducer = TxnsSlice.reducer;
export default TxnsReducer;

export const {selecttxn} = TxnsSlice.actions;