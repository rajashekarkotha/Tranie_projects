import { configureStore } from "@reduxjs/toolkit";
import TxnReducer from "./TxnSlice";

export const appStore = configureStore({
    reducer : {
        txnSlice : TxnReducer,
        //empsSlice : EmpsReducer,
    }
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;