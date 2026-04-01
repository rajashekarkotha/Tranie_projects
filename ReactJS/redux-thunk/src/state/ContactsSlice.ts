import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Contact } from "../models/Contact";
import axios from "axios";

interface ContactState {
    contacts: Contact[];
    selectedContact?: Contact;
    inProgress?: boolean;
    errMsg?: string;
}

const initialState: ContactState = {
    contacts: []
};

const apiUrl = "http://localhost:9999/contacts";

export const loadContacts = createAsyncThunk<Contact[], void>(
    'ContactsSlice/loadContacts',
    async () => {
        let data: Contact[] = [];
        try {
            data = (await axios.get(apiUrl)).data;
        } catch (err) {
            throw new Error('Failed to fetch data');
        }
        return data;
    }
);

export const addContact = createAsyncThunk<Contact, Contact>(
    'ContactsSlice/addContact',
    async (contact) => {
        let data: Contact;
        try {
            data = (await axios.post(apiUrl, contact)).data;
        } catch (err) {
            throw new Error('Failed to save');
        }
        return data;
    }
);

export const updateContact = createAsyncThunk<Contact, Contact>(
    'ContactsSlice/updateContact',
    async (contact) => {
        let data: Contact;
        try {
            data = (await axios.put(apiUrl + "/" + contact.id, contact)).data;
        } catch (err) {
            throw new Error('Failed to save');
        }
        return data;
    }
);

export const deleteContact = createAsyncThunk<Number, Number>(
    'ContactsSlice/deleteContact',
    async (id) => {
        try {
            await axios.delete(apiUrl + "/" + id);
        } catch (err) {
            throw new Error('Failed to delete');
        }
        return id;
    }
);

const ContactsSlice = createSlice({
    name: "ContactsSlice",
    initialState,
    reducers: {
        selectContact : (state, action:PayloadAction<Number>) => {
            state.selectedContact = state.contacts.find(cx => cx.id===action.payload);                        
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadContacts.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(loadContacts.fulfilled, (state, action: PayloadAction<Contact[]>) => {
                state.inProgress = false;
                state.contacts = action.payload;
            })
            .addCase(loadContacts.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
            .addCase(addContact.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(addContact.fulfilled, (state, action: PayloadAction<Contact>) => {
                state.inProgress = false;
                state.contacts.push(action.payload);
            })
            .addCase(addContact.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
            .addCase(updateContact.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(updateContact.fulfilled, (state, action: PayloadAction<Contact>) => {
                state.inProgress = false;
                let index = state.contacts.findIndex(cx => cx.id === action.payload.id);
                if (index > -1) {
                    state.contacts[index] = action.payload;
                }
            })
            .addCase(updateContact.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
            .addCase(deleteContact.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(deleteContact.fulfilled, (state, action: PayloadAction<Number>) => {
                state.inProgress = false;
                let index = state.contacts.findIndex(cx => cx.id === action.payload);
                if (index > -1) {
                    state.contacts.splice(index, 1);
                }
            })
            .addCase(deleteContact.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            });
    }
});

const ContactsReducer = ContactsSlice.reducer;
export default ContactsReducer;

export const {selectContact} = ContactsSlice.actions;