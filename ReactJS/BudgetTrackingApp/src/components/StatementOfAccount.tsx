import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Table, Button } from "react-bootstrap";
import type { AppDispatch, RootState } from "../state/AppStore";
import { loadAccount, deleteTxn, updateTxn, addTxn } from "../state/BudgetTrackingSlice";
import ViewTxnModal from "./ViewTxnModal";
import type { TxnSummary } from "../models/txnSummary";

const StatementOfAccount = () => {
  const params = useParams();
  const dispatch: AppDispatch = useDispatch();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [txn, setTxn] = useState<TxnSummary | null>({ id: 0, header: "", amount: 0, txnDate: "", txnType: "" });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const selectedAccount = useSelector((state: RootState) => state.budgetTrackingSlice.selectedAccount);
  const onAdd = () => {
    setIsEditing(false);
    setTxn({...txn, id: 0, header: "", amount: 0, txnDate: "", txnType: "" });
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
      dispatch(updateTxn({
        accountId: params.id,
        txnId: txn.id,
        data: txn
      }));
    } else {
      dispatch(addTxn({
        accountId: params.id,
        data: txn
      }));
    }
    setIsEditing(false);
    setShowModal(false);
  };
  const remove = (txnId: number) => {
    if (window.confirm("Are you sure to delete this transaction?")) {
      dispatch(deleteTxn({ accountId: params.id!, txnId }));
    }
  }
  useEffect(() => {
    if (params.id)
      dispatch(loadAccount(params.id))
  }, [params]);

  return (
    <div>
      <h4>
        {selectedAccount?.accountId}
      </h4>

      <p>
        Account Number: {selectedAccount?.accountNumber} <br />
        Bank: {selectedAccount?.bankName} <br />
        Balance: ₹ {selectedAccount?.summary.balance}
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
          {selectedAccount && selectedAccount.Txns.length > 0 && selectedAccount.Txns.map((txn: TxnSummary) => (
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
          {selectedAccount && selectedAccount.Txns.length > 0 && <TotalCredits totalCredit={selectedAccount?.summary.totalCredit} />}
          {selectedAccount && selectedAccount.Txns.length > 0 && <TotalDebits totalDebit={selectedAccount?.summary.totalDebit} />}
          {selectedAccount && selectedAccount.Txns.length > 0 && <CurrentBalance balance={selectedAccount?.summary.balance} />}
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