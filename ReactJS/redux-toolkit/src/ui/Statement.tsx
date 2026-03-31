import { useState, useEffect} from 'react';
import Col from 'react-bootstrap/Col';
import type { Txn } from "../models/Txn";
import TxnsHeader from "./TxnsHeader";
import TxnRow from "./TxnRow";
import type { AppDispatch, RootState } from "../state/AppStore";
import { useDispatch, useSelector } from "react-redux";
import { addTxn, removeTxn, updateTxn, editTxn } from "../state/TxnSlice";
import TxnForm from "./TxnForm";
import type { TxnsSummary } from '../models/TxnsSummary';
import TxnsFooter from './TxnsFooter';

const Statement = () => {
    const [txnsSummary, setTxnsSummary] = useState<TxnsSummary>({ totalCredit: 0, totalDebit: 0, balance: 0 });
    // const [errMsg, setErrMsg] = useState<string | null>(null);
    const txns : Txn[] = useSelector( (state:RootState) => state.txnSlice.txns);
    const dispatch : AppDispatch = useDispatch();

    const add = (txn:Txn) => dispatch(addTxn(txn));
    const update = (txn:Txn) => dispatch(updateTxn(txn));
    const cancelEdit = (id: number) => console.log(id);

    const edit = (id: number) => dispatch(editTxn(id)); 
    const remove = (id: number) => dispatch(removeTxn(id));

    useEffect(() => {
       if(txns && txns.length > 0){
        const sumUp = (txns: Txn[], target: string) => txns.filter(t => t.txnType === target)
              .map(t => t.amount)
              .reduce((a1,a2) => a1+a2);

              const tc = sumUp(txns, "CREDIT");
              const tdb = sumUp(txns, "DEBIT");
              setTxnsSummary({ totalCredit: tc, totalDebit: tdb, balance: tc - tdb });
       } else {
        setTxnsSummary({ totalCredit: 0, totalDebit: 0, balance: 0 });
       }
    },[txns]);

    return(
        <Col sm={10} className="m-2 mx-auto p-2">
        <div as-="h3">statement</div>

        {/* {
            errMsg && (
                <Alert variant="danger" className="p-2">
                    <strong>{errMsg}</strong>
                </Alert>
            )
        } */}
        <TxnsHeader />
        <TxnForm save={add} />
        {
            txns && txns.length > 0 && (txns.map(tx => tx.isEditable ?
            <TxnForm key={tx.id} t={tx} save={update} cancel={cancelEdit} /> :
            <TxnRow key={tx.id} txn={tx} edit={edit} remove={remove} />) 
            )  
        }
        <TxnsFooter txnsSummary={txnsSummary} />
      </Col>
    )
}

export default Statement;