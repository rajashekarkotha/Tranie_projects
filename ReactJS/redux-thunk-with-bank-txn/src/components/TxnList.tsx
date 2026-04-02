import { useDispatch, useSelector } from "react-redux";
import MsgBox from "./MsgBox";
import { Link } from "react-router";
import type { AppDispatch, RootState } from "../state/AppStore";
import { deletetxn, loadtxns } from "../state/TxnsSlice";
import type { Txn } from "../models/Txn";
import { useEffect } from "react";

const TxnList = () => {

    const txns: Txn[] = useSelector((state: RootState) => state.txnsSlice.txns)
    const inProgress: boolean | undefined = useSelector((state: RootState) => state.txnsSlice.inProgress)
    const errMsg: string | undefined = useSelector((state: RootState) => state.txnsSlice.errMsg)
    const dispatch: AppDispatch = useDispatch();
    useEffect(()=>{
        dispatch(loadtxns())
    },[]);

    const del = (id: number) => dispatch(deletetxn(id));

    return (
        <section className="col-sm-10 mx-auto p-2 m-2">
            <h4>Txn List</h4>

            {inProgress && <MsgBox msg="Please wait while loading" type="info" />}

            {errMsg && <MsgBox msg={errMsg} type="error" />}

            {
                txns.length === 0 ?
                    <MsgBox msg="No records to display" type="info" /> :
                    <table className="table table-bordewred table-striped table-hover">
                        <thead>
                            <tr className="text-center">
                                <th>Txn#</th>
                                <th>Txn Date</th>
                                <th>Header</th>
                                <th>Credit</th>
                                <th>Debit</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {txns.map(tx => (
                                <tr key={tx.id}>
                                    <td className="text-emd">{tx.id}</td>
                                    <td className="text-start">{tx.txnDate}</td>
                                    <td className="text-center">{tx.txnType}</td>
                                    <td className="text-start">{tx.amount}</td>
                                    <td className="text-end">
                                        <Link className="btn btn-sm me-1" to={`/edit/${tx.id}`}>
                                            <i className="bi bi-pen text-secondary" />
                                        </Link>
                                        <button type="button" className="btn btn-sm" onClick={_e => del(tx.id)}>
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

export default TxnList;