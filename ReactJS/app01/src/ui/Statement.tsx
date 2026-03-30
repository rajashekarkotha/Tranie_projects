import { useEffect, useState } from "react";
import type { Txn } from "../models/Txn";
import TxnsHeader from "./TxnsHeader";
import TxnRow from "./TxnRow";
import { addTxn, delTxnById, getAllTxns, saveTxn } from "../services/txnsApi";
import type { TxnsSummary } from "../models/TxnsSummary";
import TxnsFooter from "./TxnsFooter";
import TxnForm from "./TxnForm";

const Statement = () => {
    const [txns, setTxns] = useState<Txn[]>([]);
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const [txnsSummary, setTxnsSummary] = useState<TxnsSummary>({ totalCredit: 0, totalDebit: 0, balance: 0 });

    //componentDidMount
    useEffect(() => {
        getAllTxns().then(resp => setTxns(resp.data))
        .catch(err =>{
             console.log(err);
             setErrMsg("Unable to fetech records. Please try again later!");
        });
    }, []);

    //conponentDidUpdate - sideEffect - update summary if thers any change in txns
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

    const add = (txn: Txn) => {
        addTxn(txn).then(resp => setTxns([...txns, {...resp.data}]))
        .catch(err =>{
             console.log(err);
             setErrMsg("Unable to save record. Please try again later!");
        });
    }
    
    
    const update = (txn: Txn) => {
        txn.isEditable = undefined;
        saveTxn(txn.id, txn)
          .then(resp => setTxns(txns.map(tx => tx.id === txn.id ? {...resp.data} : tx)))
          .catch(err =>{
             console.log(err);
             setErrMsg("Unable to update record. Please retry later!");
        });
    }

    const remove = (id: number) => {
        delTxnById(id).then(_resp => setTxns(txns.filter(tx => tx.id !== id)))
        .catch(err =>{
            console.log(err);
            setErrMsg("Unable to delete record. Please retry later!");
       });
    }
     
    const edit = (id: number) => {
        setTxns(txns.map(tx => tx.id === id ? { ...tx, isEditable: true } : tx));
    }

    const cancelEdit = (id: number) => {
        setTxns(txns.map(tx => tx.id === id ? { ...tx, isEditable: undefined } : tx));
    }

    return(
      <section className="col-sm-10 m-2 mx-auto p-2">
        <h3>statement</h3>

        {
            errMsg && (
                <div className="alert alert-danger p-2">
                    <strong>{errMsg}</strong>
                </div>
            )
        }
        <TxnsHeader />
        <TxnForm save={add} />
        {
            txns && txns.length > 0 && ( txns.map(tx => tx.isEditable ?
            <TxnForm key={tx.id} t={tx} save={update} cancel={cancelEdit} /> :
            <TxnRow key={tx.id} txn={tx} edit={edit} remove={remove} />) 
            )  
        }
        <TxnsFooter txnsSummary={txnsSummary} />
      </section>
    )
}

export default Statement;