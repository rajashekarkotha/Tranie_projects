import { useEffect, useState, type FormEvent } from "react";
import type { Contact } from "../models/Contact";
import { useNavigate, useParams } from "react-router";
import type { AppDispatch, RootState } from "../state/AppStore";
import { useDispatch, useSelector } from "react-redux";
import { addContact, selectContact, updateContact } from "../state/ContactsSlice";

const ContactForm = () => {

    const [contact,setContact] = useState<Contact>({id:0,fullName:'',mailId:'',mobile:''});
    const [isEditing,setEditing] = useState<boolean>(false);

    const dispatch : AppDispatch = useDispatch();
    const selectedContact:Contact|undefined = useSelector((state:RootState) => state.contactsSlice.selectedContact);
    
    const add = (contact:Contact) => dispatch(addContact(contact))
    const update = (contact:Contact) => dispatch(updateContact(contact))
    const getContact = (id:number) => dispatch(selectContact(id))

    const params = useParams();
    const navigate = useNavigate();

    useEffect(()=>{
        if(params.id){
            setEditing(true);
            getContact(Number(params.id));                      
        }else{
            setEditing(false);
        }
    },[params]);

    useEffect(()=>{
        if(selectedContact){
            setContact(selectedContact);
        }        
    },[selectedContact]);

    const formSubmitted = (e:FormEvent) => {
        e.preventDefault();
        if(isEditing){
            update && update(contact);
        }else{
            add && add(contact);
        }
        navigate("/");
    }

    return (
        <section className="col-sm-5 mx-auto p-2 m-2">
            <h4>{isEditing?"Edit ":"New "} Contact</h4>
            <form onSubmit={formSubmitted}>
                <div className="form-group mb-1">
                    <label className="form-label">Contact Id</label>
                    <input type="number" className="form-control" value={contact.id}
                    onChange={ e => setContact({...contact, id:Number(e.target.value)})} />
                </div>
                <div className="form-group mb-1">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" value={contact.fullName} 
                    onChange={ e => setContact({...contact, fullName:e.target.value})} />
                </div>
                <div className="form-group mb-1">
                    <label className="form-label">Mobile</label>
                    <input type="text" className="form-control" value={contact.mobile} 
                    onChange={ e => setContact({...contact, mobile:e.target.value})} />
                </div>
                <div className="form-group mb-1">
                    <label className="form-label">Mail Id</label>
                    <input type="text" className="form-control" value={contact.mailId} 
                    onChange={ e => setContact({...contact, mailId:e.target.value})} />
                </div>
                <div className="d-grid">
                    <button className="btn btn-primary">SAVE</button>
                </div>
            </form>
        </section>
    );
};

export default ContactForm;