// import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
// import { useParams } from "react-router";
// import { useDispatch } from "react-redux";
// import type { AppDispatch } from "../state/AppStore";
import type { TxnSummary } from "../models/txnSummary";
// import { updateTxn, addTxn } from "../state/BudgetTrackingSlice";


const ViewTxnModal = ({ txnData, show, onClose, setTxnData, formSubmit }: { txnData: TxnSummary, show: boolean, onClose: (value: boolean) => void, setTxnData: (data: TxnSummary) => void, formSubmit: () => void }) => {
  // const dispatch: AppDispatch = useDispatch();
  // const { id } = useParams<{ id: string }>();
  // console.log("Txn data ", txnData);
  const formSubmitted = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (!id || !txnData) return;

    // if (txnData.id) {
    //   dispatch(updateTxn({ accountId: id, txnId: txnData.id, data: txnData }));
    // } else {
    //   dispatch(addTxn({ accountId: id, data: txnData }));
    // }
    formSubmit(); 
    // onClose(false);
  }

  // useEffect(() => {
  //   if (txn) {
  //     setTxnData(txn);
  //   } else {
  //     setTxnData(null);
  //   }
  // }, [txn]);

  return (
    <>
      <Modal show={show} onHide={() => onClose(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Account Transactions</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <section className="col-sm-8 mx-auto p-2 m-2">
            {/* <h4>{isEditing?"Edit ":"New "} Contact</h4> */}
            <form onSubmit={formSubmitted}>
              <div className="form-group mb-1">
                <label className="form-label">txn Id</label>
                <input type="number" className="form-control" value={txnData?.id}
                  onChange={e => txnData && setTxnData({ ...txnData, id: parseInt(e.target.value, 10) })} />
              </div>
              <div className="form-group mb-1">
                <label className="form-label">Date</label>
                <input type="date" className="form-control" value={txnData?.txnDate}
                  onChange={e => txnData && setTxnData({ ...txnData, txnDate: e.target.value })} />
              </div>
              <div className="form-group mb-1">
                <label className="form-label">header</label>
                <input type="text" className="form-control" value={txnData?.header}
                  onChange={e => txnData && setTxnData({ ...txnData, header: e.target.value })} />
              </div>
               <div className="form-group mb-1">
                <label className="form-label">Transaction type</label>
                <input type="text" className="form-control" value={txnData?.txnType}
                  onChange={e => txnData && setTxnData({ ...txnData, txnType: e.target.value })} />
              </div>


              <div className="form-group mb-1">
                <label className="form-label">Amount</label>
                <input type="number" className="form-control" value={txnData?.amount}
                  onChange={e => txnData && setTxnData({ ...txnData, amount: parseFloat(e.target.value) })} />
              </div>
              <div className="d-grid mt-2">
                <button className="btn btn-primary">SAVE</button>
              </div>
            </form>
          </section>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ViewTxnModal;