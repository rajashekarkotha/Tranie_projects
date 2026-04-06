import { useState } from "react";
import { Modal } from "react-bootstrap";
import type { AccountSummary } from "../models/accountSummary";
import { addBankAccount } from "../state/BudgetTrackingSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../state/AppStore";

const AddAccountModal = ({ show, onClose, customerId }: { show: boolean, onClose: (value: boolean) => void, customerId: string }) => {
    const dispatch: AppDispatch = useDispatch();
    const [accountData, setAccountData] = useState({
        accountId: "",
        accountNumber: "",
        bankName: "",
        accountType: "SAVINGS",
        // Txns: [],
        // summary: {
        //     totalCredit: 0,
        //     totalDebit: 0,
        //     balance: 0
        // }
    });

    const formSubmitted = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // console.log("Account data ", accountData);
        // const { accountId, ...data } = accountData;
        // const { accountId, ...data } = accountData;
        dispatch(addBankAccount({ customerId, data: accountData }));
        onClose(false);
    }
    return (
        <>
            <Modal show={show} onHide={() => onClose(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add Bank Account</Modal.Title>
                       </Modal.Header>
                    <Modal.Body>
                        <section className="col-sm-8 mx-auto p-2 m-2">
                            {/* <h4>{isEditing?"Edit ":"New "} Contact</h4> */}
                            <form onSubmit={formSubmitted}>
                                <div className="form-group mb-1">
                                    <label className="form-label">Account Id</label>
                                    <input type="text" className="form-control" value={accountData?.accountId}
                                        onChange={e => setAccountData({ ...accountData, accountId: e.target.value })} />
                                </div>
                                <div className="form-group mb-1">
                                    <label className="form-label">Account Number</label>
                                    <input type="text" className="form-control" value={accountData.accountNumber}
                                        onChange={e => setAccountData({ ...accountData, accountNumber: e.target.value })} />
                                </div>
                                <div className="form-group mb-1">
                                    <label className="form-label">Bank Name</label>
                                    <input type="text" className="form-control" value={accountData?.bankName}
                                        onChange={e => setAccountData({ ...accountData, bankName: e.target.value })} />
                                </div>
                                <div className="form-group mb-1">
                                    <label className="form-label">Account Type</label>
                                    <select className="form-control" value={accountData.accountType}
                                        onChange={e => setAccountData({ ...accountData, accountType: e.target.value as AccountSummary['accountType'] })}>
                                        <option value="SAVINGS">Savings</option>
                                        <option value="CHECKING">Checking</option>
                                        <option value="CREDIT">Credit</option>
                                    </select>
                                </div>
                                <div className="d-grid mt-2">
                                    <button className="btn btn-primary">Add Account</button>
                                </div>
                            </form>
                        </section>
                    </Modal.Body>
            </Modal>
        </>
    );
};

export default AddAccountModal;