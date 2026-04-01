import { useDispatch, useSelector } from "react-redux";
import MsgBox from "./MsgBox";
import { Link } from "react-router";
import type { AppDispatch, RootState } from "../state/AppStore";
import { deleteContact, loadContacts } from "../state/ContactsSlice";
import type { Contact } from "../models/Contact";
import { useEffect } from "react";

const ContactsList = () => {

    const contacts: Contact[] = useSelector((state: RootState) => state.contactsSlice.contacts)
    const inProgress: boolean | undefined = useSelector((state: RootState) => state.contactsSlice.inProgress)
    const errMsg: string | undefined = useSelector((state: RootState) => state.contactsSlice.errMsg)
    const dispatch: AppDispatch = useDispatch();

    useEffect(()=>{
        dispatch(loadContacts())
    },[]);

    const del = (id: number) => dispatch(deleteContact(id));

    return (
        <section className="col-sm-10 mx-auto p-2 m-2">
            <h4>Contacts List</h4>

            {inProgress && <MsgBox msg="Please wait while loading" type="info" />}

            {errMsg && <MsgBox msg={errMsg} type="error" />}

            {
                contacts.length === 0 ?
                    <MsgBox msg="No records to display" type="info" /> :
                    <table className="table table-bordewred table-striped table-hover">
                        <thead>
                            <tr className="text-center">
                                <th>Contact#</th>
                                <th>Full Name</th>
                                <th>Mobile</th>
                                <th>Mail Id</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map(cx => (
                                <tr key={cx.id}>
                                    <td className="text-emd">{cx.id}</td>
                                    <td className="text-start">{cx.fullName}</td>
                                    <td className="text-center">{cx.mobile}</td>
                                    <td className="text-start">{cx.mailId}</td>
                                    <td className="text-end">
                                        <Link className="btn btn-sm me-1" to={`/edit/${cx.id}`}>
                                            <i className="bi bi-pen text-secondary" />
                                        </Link>
                                        <button type="button" className="btn btn-sm" onClick={_e => del(cx.id)}>
                                            <i className="bi bi-trash text-danger" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>
            }
        </section>
    );
};

export default ContactsList;