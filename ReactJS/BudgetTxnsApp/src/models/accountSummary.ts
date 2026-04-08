
type AccountType = "SAVINGS" | "CURRENT";

type summary = {
   totalCredit: number,
   totalDebit: number,
   balance: number
}

export interface AccountSummary {
   accountId: string,
   customerId: string,
   accountNumber: string,
   bankName: string,
   accountType: AccountType,
   currency?: string,
   status?:string
   summary?:summary
}