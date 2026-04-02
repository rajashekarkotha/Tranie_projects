import { configureStore } from "@reduxjs/toolkit";
import TxnsReducer from "./TxnsSlice";

export const appStore = configureStore({
    reducer : {
        txnsSlice : TxnsReducer
    }
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;