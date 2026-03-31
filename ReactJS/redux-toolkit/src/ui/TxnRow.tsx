import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import type { Txn } from "../models/Txn";
import Button from 'react-bootstrap/Button';

type TxnRowProps = {
    txn: Txn,
    edit: (id: number) => void,
    remove: (id: number) => void
};

const TxnRow = ({ txn, edit, remove }: TxnRowProps) => (
  <Row className="p-1 mb-1 border-bottom border-info">
    <Col xs={1} className="1">{txn.id}</Col>
    <Col xs={2} className="2 text-center">{txn.txnDate}</Col>
    <Col>{txn.header}</Col>
    <Col xs={2} className="text-end">{txn.txnType === "CREDIT" && txn.amount}</Col>
    <Col xs={2} className="2 text-end">{txn.txnType === "DEBIT" && txn.amount}</Col>
    <Col xs={2} className="2 text-center">
        <Button variant='secondary' size="sm" onClick={_e => edit(txn.id)}>
            <i className="bi bi-pencil-square" title="EDIT"/>
        </Button>
        <Button variant='danger' size="sm" onDoubleClick={_e => remove(txn.id)}>
            <i className="bi bi-trash" title="double click to DELETE"/>
        </Button>
    </Col>
    </Row>
);

export default TxnRow;