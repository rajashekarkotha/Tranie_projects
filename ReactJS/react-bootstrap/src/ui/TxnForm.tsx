import { Fragment, useState, type SubmitEvent } from "react";
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import type { Txn } from "../models/Txn";
import { addTxn } from "../services/txnsApi";

type TxnFormProps = {
    t?: Txn,
    save: (txn: Txn) => void,
    cancel?: (id: number) => void
}


const TxnForm = ({ t, save, cancel }: TxnFormProps) => {
   const [txn, setTxn] = useState<Txn>(
    t ? { ...t } : { id: 0, header: "", txnDate: new Date().toISOString().substring(0, 10), txnType: "CREDIT", amount: 0 }
  );
  const toggleType = (txnType: string) => {
    setTxn({ ...txn, txnType });
  };
 
  const formSubmitted = (e: SubmitEvent) => {
    e.preventDefault();
    save({ ...txn });
    if (!txn.isEditable) {
      setTxn({
        id: 0,
        header: '',
        txnDate: new Date().toISOString().substring(0, 10),
        txnType: 'CREDIT',
        amount: 0,
      });
    }
  };
    return (
        <Form className="row p-1 mb-1 border-bottom border-info" onSubmit={formSubmitted}>
            <Col xs={1}>{txn.id}</Col>
            <Col xs={2} className="text-center">
                <Form.Control type="date" value={txn.txnDate} onChange={e => setTxn({ ...txn, txnDate: e.target.value })} 
                />
            </Col>
            <Col className="col">
                <Form.Control type="text" value={txn.header} onChange={e => setTxn({ ...txn, header: e.target.value })}
                />
            </Col>
            <Col xs={2} className="text-end" onClick={_e => toggleType("CREDIT")}>
                {txn.txnType === "CREDIT" && <Form.Control type="number" value={txn.amount} onChange={e => setTxn({ ...txn, amount: Number(e.target.value) })} />}
            </Col>
            {/* <Col xs={2} className="text-end">
  <div onClick={() => toggleType("CREDIT")}>
    {txn.txnType === "CREDIT" && (
      <Form.Control
        type="number"
        value={txn.amount}
        onChange={e => setTxn({ ...txn, amount: Number(e.target.value) })}
      />
    )}
  </div>
</Col> */}

            <Col xs={2} className="text-end" onClick={_e => toggleType("DEBIT")}>
                {txn.txnType === "DEBIT" && <Form.Control type="number" value={txn.amount} onChange={e => setTxn({ ...txn, amount: Number(e.target.value) })} />} 
            </Col>
            {/* <Col xs={2} className="text-end">
  <div onClick={() => toggleType("DEBIT")}>
    {txn.txnType === "DEBIT" && (
      <Form.Control
        type="number"
        value={txn.amount}
        onChange={e => setTxn({ ...txn, amount: Number(e.target.value) })}
      />
    )}
  </div>
</Col> */}

            <Col xs={2} className="text-center">
                <Button variant="primary" size="sm" type="submit">
                    <i className="bi bi-floppy" />
                </Button>
                {txn.isEditable && (<Button type="button" variant="danger"  size="sm" className="ms-1" onClick={_e => cancel && cancel(txn.id)}>
                    <i className="bi bi-x-circle" />
                </Button>)}
            
            </Col>
        </Form>
    )
}

export default TxnForm;