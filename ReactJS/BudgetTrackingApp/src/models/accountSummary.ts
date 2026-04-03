import type { TxnSummary } from "./txnSummary";

type AccountType = "SAVINGS" | "CURRENT";

type summary = {
    totalTxns?: number,
    totalCredit: number,
    totalDebit: number,
    balance: number
}

export interface AccountSummary {
   accountId: string,
   accountNumber: string,
   bankName: string,
   accountType: AccountType,
   currency?: string,
   status?:string,
   Txns: TxnSummary[],
   summary: summary
}