import { useEffect, useState, type FormEvent } from "react";
import type { Txn } from "../models/Txn";
import { useNavigate, useParams } from "react-router";
import type { AppDispatch, RootState } from "../state/AppStore";
import { useDispatch, useSelector } from "react-redux";
import { addtxn, selecttxn, updatetxn } from "../state/TxnsSlice";

const TxnForm = () => {

    const [txn,setTxn] = useState<Txn>({id:0, txnDate:"", header:"", txnType:"CREDIT", amount:0});
    const [isEditing,setEditing] = useState<boolean>(false);

    const dispatch : AppDispatch = useDispatch();
    const selectedContact:Txn|undefined = useSelector((state:RootState) => state.txnsSlice.selectedtxn);
    
    const add = (txn:Txn) => dispatch(addtxn(txn))
    const update = (txn:Txn) => dispatch(updatetxn(txn))
    const getContact = (id:number) => dispatch(selecttxn(id))

    const params = useParams();
    const navigate = useNavigate();

    useEffect(()=>{
        if(params.id){
            setEditing(true);
            setTxn({...txn, id: Number(params.id)});
        }else{
            setEditing(false);
        }
    },[params]);

    useEffect(()=>{
        if(selectedContact){
            setTxn(selectedContact);
        }        
    },[selectedContact]);

    const formSubmitted = (e:FormEvent) => {
        e.preventDefault();
        if(isEditing){
            update && update(txn);
        }else{
            add && add(txn);
        }
        navigate("/");
    }

    return (
        <section className="col-sm-5 mx-auto p-2 m-2">
            <h4>{isEditing?"Edit ":"New "} Contact</h4>
            <form onSubmit={formSubmitted}>
                <div className="form-group mb-1">
                    <label className="form-label">txn id</label>
                    <input type="number" className="form-control" value={txn.id}
                    onChange={ e => setTxn({...txn, id:Number(e.target.value)})} />
                </div>
                <div className="form-group mb-1">
                    <label className="form-label">Header</label>
                    <input type="text" className="form-control" value={txn.header} 
                    onChange={ e => setTxn({...txn, header:e.target.value})} />
                </div>
                <div className="form-group mb-1">
                    <label className="form-label">Date</label>
                    <input type="text" className="form-control" value={txn.txnDate} 
                    onChange={ e => setTxn({...txn, txnDate:e.target.value})} />
                </div>
                <div className="form-group mb-1">
                    <label className="form-label">Type</label>
                    <input type="text" className="form-control" value={txn.txnType} 
                    onChange={ e => setTxn({...txn, txnType:e.target.value})} />
                </div>
                <div className="d-grid">
                    <button className="btn btn-primary">SAVE</button>
                </div>
            </form>
        </section>
    );
};

export default TxnForm;