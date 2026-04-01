import { configureStore } from "@reduxjs/toolkit";
import ContactsReducer from "./ContactsSlice";

export const appStore = configureStore({
    reducer : {
        contactsSlice : ContactsReducer
    }
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;