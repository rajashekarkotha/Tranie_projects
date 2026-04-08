 export interface TxnSummary {
    id: number,
    accountId?: string,
    customerId?: string,
    txnRef?: string,
    txnDate: string,
    txnType: "DEBIT" | "CREDIT",
    header: string,
    amount: number,
    mode?: string
}