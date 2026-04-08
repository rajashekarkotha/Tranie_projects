import { useState } from "react";
import type { CustomersData } from "../../models/CustomersData";
import { addCustomer } from "../../state/BudgetTrackingSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../state/AppStore";
import { useNavigate } from "react-router";


const AddCustomer = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
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
        console.log("Customer data ", customerData);
        dispatch(addCustomer(customerData));
        navigate("/");
    }
  return (
    <section className="col-sm-5 mx-auto p-2 m-2">
                {/* <h4>{isEditing?"Edit ":"New "} Contact</h4> */}
                <form onSubmit={formSubmitted}>
                    <div className="form-group mb-1">
                        <label className="form-label">Customer Id</label>
                        <input type="text" className="form-control" value={customerData?.customerId}
                            onChange={e => setCustomerData({ ...customerData, customerId: e.target.value })} />
                    </div>
                  
                    <div className="form-group mb-1">
                        <label className="form-label">Customer Name</label>
                        <input type="text" className="form-control" value={customerData?.customerName}
                            onChange={e => setCustomerData({ ...customerData, customerName: e.target.value })} />
                    </div>
                      <div className="form-group mb-1">
                        <label className="form-label">Mobile</label>
                        <input type="text" className="form-control" value={customerData.mobile}
                            onChange={e => setCustomerData({ ...customerData, mobile: e.target.value })} />
                    </div>
                    <div className="form-group mb-1">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" value={customerData.email}
                            onChange={e => setCustomerData({ ...customerData, email: e.target.value })} />
                    </div>
                    <div className="form-group mb-1">
                        <label className="form-label">KYC Status</label>
                        <select className="form-control" value={customerData.kycStatus}
                            onChange={e => setCustomerData({ ...customerData, kycStatus: e.target.value })}>
                            <option value="PENDING">Pending</option>
                            <option value="VERIFIED">Verified</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                    <div className="d-grid mt-2">
                        <button className="btn btn-primary">Add Customer</button>
                    </div>
                </form>
            </section>
  );
};
export default AddCustomer;
