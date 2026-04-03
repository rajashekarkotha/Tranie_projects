import { useState } from "react";
import { Modal } from "react-bootstrap";
import type { CustomersData } from "../models/CustomersData";


const AddCustomerModal = ({ show, onClose }: { show: boolean, onClose: (value: boolean) => void }) => {
    const [customerData, setCustomerData] = useState<CustomersData>({
        customerId: "",
        customerName: "",
        mobile: "",
        email: "",
        kycStatus: "",
        createdAt: "",
        accounts: []
    });

    const formSubmitted = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }
    return (
        <>
            <Modal show={show} onHide={() => onClose(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Account Transactions</Modal.Title>
                    <input type="text" className="form-control" value={customerData.customerId}
                        onChange={e => setCustomerData({ ...customerData, customerId: e.target.value })} />
                    <Modal.Body>
                        <section className="col-sm-8 mx-auto p-2 m-2">
                            {/* <h4>{isEditing?"Edit ":"New "} Contact</h4> */}
                            <form onSubmit={formSubmitted}>
                                <div className="form-group mb-1">
                                    <label className="form-label">Customer Id</label>
                                    <input type="text" className="form-control" value={customerData?.customerId}
                                        onChange={e => setCustomerData({ ...customerData, customerId: e.target.value })} />
                                </div>
                                <div className="form-group mb-1">
                                    <label className="form-label">Mobile</label>
                                    <input type="text" className="form-control" value={customerData.mobile}
                                        onChange={e => setCustomerData({ ...customerData, mobile: e.target.value })} />
                                </div>
                                <div className="form-group mb-1">
                                    <label className="form-label">Customer Name</label>
                                    <input type="date" className="form-control" value={customerData?.customerName}
                                        onChange={e => setCustomerData({ ...customerData, customerName: e.target.value })} />
                                </div>
                                <div className="form-group mb-1">
                                    <label className="form-label">Email</label>
                                    <input type="text" className="form-control" value={customerData.email}
                                        onChange={e => setCustomerData({ ...customerData, email: e.target.value })} />
                                </div>
                                <div className="d-grid mt-2">
                                    <button className="btn btn-primary">Add Customer</button>
                                </div>
                            </form>
                        </section>
                    </Modal.Body>
                </Modal.Header>
            </Modal>
        </>
    );
};

export default AddCustomerModal;