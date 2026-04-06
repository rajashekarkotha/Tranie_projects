import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Table, Button } from "react-bootstrap";
import type { AppDispatch } from "../state/AppStore";
import type { AccountSummary } from "../models/accountSummary";
import { Link } from "react-router";
import AddAccountModal from "./AddAccountModal";
import { loadCustomers } from "../state/BudgetTrackingSlice";

const AccountsSummary = ({ accountSummary, customerId }: { accountSummary: AccountSummary[], customerId:string }) => {
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const dispatch: AppDispatch = useDispatch();

  const addAccount = () => {
    setShowAddAccountModal(true);
  }

  useEffect(() => {
    if(!showAddAccountModal)
    dispatch(loadCustomers());
  }, [showAddAccountModal]);
  return (
    <Table bordered size="sm">
      <thead className="table-secondary">
        <tr>
          <th>Account ID</th>
          <th>Bank Name</th>
          <th>Account Type</th>
          <th>Balance</th>
          <th>
             <Button
              type="button"
              variant="outline-info"
              size="sm"
              onClick={(_e) => addAccount()}
            >
              <i className="bi bi-plus" title="ADD Account" /> ADD Account
            </Button>
          </th>
        </tr>
      </thead>
      <tbody>
        {accountSummary.map((acc) => (
          <tr key={acc.accountId}>
            <td>{acc.accountId}</td>
            <td>{acc.bankName}</td>
            <td>{acc.accountType}</td>
            <td>{acc.summary.balance}</td>
            <td>
              <Link className="btn btn-sm me-1" to={`/edit/${acc.accountId}`}>
                <i className="bi bi-file-text" />
              </Link>
            </td>
          </tr> 
        ))}
      </tbody>
      <AddAccountModal show={showAddAccountModal} onClose={setShowAddAccountModal} customerId={customerId} />
    </Table>
  );
};

export default AccountsSummary;