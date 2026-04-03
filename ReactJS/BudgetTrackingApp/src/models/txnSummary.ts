export interface TxnSummary {
    id: number,
    txnRef?: string,
    txnDate: string,
    txnType: string,
    header: string,
    amount: number,
    mode?: string
}