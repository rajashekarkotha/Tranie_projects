 export interface TxnSummary {
    id: number,
    txnRef?: string,
    txnDate: string,
    txnType: "DEBIT" | "CREDIT",
    header: string,
    amount: number,
    mode?: string
}