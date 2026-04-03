import { Table, Button } from "react-bootstrap";
import type { AccountSummary } from "../models/accountSummary";
import { Link } from "react-router";

const AccountsSummary = ({ accountSummary }: { accountSummary: AccountSummary[] }) => {
  return (
    <Table bordered size="sm">
      <thead className="table-secondary">
        <tr>
          <th>Account ID</th>
          <th>Bank Name</th>
          <th>Account Type</th>
          <th>Balance</th>
          <th></th>
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
    </Table>
  );
};

export default AccountsSummary;