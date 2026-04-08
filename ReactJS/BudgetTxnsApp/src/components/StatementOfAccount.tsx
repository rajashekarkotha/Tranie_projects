import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Table, Button } from "react-bootstrap";
import type { AppDispatch, RootState } from "../state/AppStore";
import { loadTxns, deleteTxn } from "../state/TxnsTrackingSlice";
import ViewTxnModal from "./ViewTxnModal";
import type { AccountSummary } from "../models/accountSummary";
import type { TxnSummary } from "../models/txnSummary";
import { loadAccounts } from "../state/AccountTrackingSlice";

const StatementOfAccount = () => {
    const params = useParams();
    const { id } = params;
    const dispatch: AppDispatch = useDispatch();
    const [selectedAccount, setSelectedAccount] = useState<AccountSummary | null>(null)
    const [showModal, setShowModal] = useState<boolean>(false);
    const [txn, setTxn] = useState<TxnSummary | null>({ id: 0, header: "", amount: 0, txnDate: "", txnType: "DEBIT" });
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const txns: TxnSummary[] = useSelector((state: RootState) => state.txnsTrackingSlice.Txns);
    const accounts: AccountSummary[] = useSelector((state: RootState) => state.budgetTrackingSlice.accounts);
    const onAdd = () => {
        setIsEditing(false);
        setTxn({ ...txn, id: 0, header: "", amount: 0, txnDate: "", txnType: "DEBIT" });
        setShowModal(true);
    };

    const onEdit = (txn: TxnSummary) => {
        setIsEditing(true);
        setTxn({ ...txn });
        setShowModal(true);
    };
      const formSubmit = () => {
        if (!txn || !params.id) return;
        if (isEditing) {
        //   dispatch(updateTxn({
        //     accountId: params.id,
        //     txnId: txn.id,
        //     data: txn
        //   }));
        } else {
        //   dispatch(addTxn({
        //     accountId: params.id,
        //     data: txn
        //   }));
        }
        dispatch(loadAccounts());
        setIsEditing(false);
        setShowModal(false);
       
      };
    const remove = (txnId: number) => {
        if (window.confirm("Are you sure to delete this transaction?")) {
              dispatch(deleteTxn({ accountId: id!, txnId: txnId }));
        }
    }
       // ✅ Effect 1: select account
    useEffect(() => {
      if (!id || accounts.length === 0) return;
    
      const account = accounts.find(
        acc => acc.accountId === id
      );
      if (account) {
        setSelectedAccount({ ...account });
      }
    }, [id, accounts]);


    // ✅ Effect 2: load txns ONLY when accountId changes
    useEffect(() => {
      if (!id) return;
    
      dispatch(loadTxns({ id }));
    }, [id]);

    return (
        <div>
            <h4>
                {selectedAccount?.accountId}
            </h4>

            <p>
                Account Number: {selectedAccount?.accountNumber} <br />
                Bank: {selectedAccount?.bankName} <br />
                Balance: ₹ {selectedAccount?.summary?.balance}
            </p>

            <h5>Transactions</h5>

            <Table bordered hover>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Type of Transacation</th>
                        <th>Credit Details</th>
                        <th>Debit Details</th>
                        <th>
                            <Button
                                type="button"
                                variant="primary"
                                size="sm"
                                onClick={(_e) => onAdd()}
                            >
                                <i className="bi bi-plus" title="ADD" /> ADD
                            </Button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {txns && txns.length > 0 && txns?.map((txn: TxnSummary) => (
                        <tr key={txn.id}>
                            <td>{txn.txnDate}</td>
                            <td>{txn.header}</td>
                            <td>{txn.txnType.toLocaleUpperCase()}</td>
                            <td>{txn.txnType === "CREDIT" && txn.amount}</td>
                            <td>{txn.txnType === "DEBIT" && txn.amount}</td>
                            <td>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={(_e) => onEdit(txn)}
                                >
                                    <i className="bi bi-pen" title="EDIT" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="danger"
                                    size="sm"
                                    className="ms-1"
                                    onClick={(_e) => remove(txn.id)}
                                >
                                    <i className="bi bi-trash" title="Double click to delete" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {selectedAccount && <TotalCredits totalCredit={selectedAccount?.summary?.totalCredit ?? 0} />}
                    {selectedAccount && <TotalDebits totalDebit={selectedAccount?.summary?.totalDebit ?? 0} />}
                    {selectedAccount && <CurrentBalance balance={selectedAccount?.summary?.balance ?? 0} />}
                </tbody>
            </Table>

    <ViewTxnModal
        show={showModal}
        onClose={() => setShowModal(false)}
        txnData={txn!}
        setTxnData={setTxn}
        formSubmit={formSubmit}
      /> 

        </div>
    );
};

const TotalCredits = ({ totalCredit }: { totalCredit: number }) => {
    // return txns.filter(txn => txn.txnType === "CREDIT").reduce((sum, txn) => sum + txn.amount, 0);
    return (
        <tr>
            <td colSpan={3} className="text-end">Total Credits</td>
            <td colSpan={0}>{totalCredit}</td>
        </tr>
    )
}

const TotalDebits = ({ totalDebit }: { totalDebit: number }) => {
    // return txns.filter(txn => txn.txnType === "DEBIT").reduce((sum, txn) => sum + txn.amount, 0);
    return (
        <tr>
            <td colSpan={3} className="text-end">Total Debits</td>
            <td colSpan={12}>{totalDebit}</td>
        </tr>
    );
}

const CurrentBalance = ({ balance }: { balance: number }) => {
    // const credits = totalCredits(txns);
    // const debits = totalDebits(txns);
    // return credits - debits;
    return (
        <tr>
            <td colSpan={3} className="text-end">Balance</td>
            <td colSpan={0}>{balance}</td>
        </tr>
    );
}

export default StatementOfAccount;