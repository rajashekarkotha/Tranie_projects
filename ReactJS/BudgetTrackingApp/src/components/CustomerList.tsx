import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Collapse } from "react-bootstrap";

import type { AppDispatch, RootState } from "../state/AppStore";
import { loadCustomers } from "../state/BudgetTrackingSlice";
import type { CustomersData } from "../models/CustomersData";
import AccountSummary from "./AccountsSummary";

const CustomerList = () => {
  const [openRow, setOpenRow] = useState<string | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const customers: CustomersData[] = useSelector((state: RootState) => state.budgetTrackingSlice.customerSummary);

  // const onAdd = () => {}
  const toggleRow = (id: string) => {
    setOpenRow(prev => (prev === id ? null : id));
  };

  useEffect(() => {
    dispatch(loadCustomers())
  }, []);

  return (
    <Table bordered hover>
      <thead className="table-dark">
        <tr>
          <th>
             {/* <Button
              type="button"
              variant="outline-info"
              size="sm"
              onClick={(_e) => onAdd()}
            >
              <i className="bi bi-plus" title="ADD" /> ADD Customer
            </Button> */}
          </th>
          <th>Customer ID</th>
          <th>Customer Name</th>
          <th>Mobile Number</th>
          <th>Email</th>
        </tr>
      </thead>

      <tbody>
        {customers.map(customer => (
          <>
            {/* Parent Row */}
            <tr key={customer.customerId}>
              <td>
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => toggleRow(customer.customerId)}
                >
                  {openRow === customer.customerId ? "▼" : "▶"}
                </Button>
              </td>
              <td>{customer.customerId}</td>
              <td>{customer.customerName}</td>
              <td>{customer.mobile}</td>
              <td>{customer.email}</td>
            </tr>

            {/* Nested Row */}
            <tr>
              <td colSpan={5} style={{ padding: 0 }}>
                <Collapse in={openRow === customer.customerId}>
                  <div className="p-3">
                    <AccountSummary accountSummary={customer.accounts} customerId={customer.customerId} />
                  </div>
                </Collapse>
              </td>
            </tr>
          </>
        ))}
      </tbody>
    </Table>
  )
}

export default CustomerList;