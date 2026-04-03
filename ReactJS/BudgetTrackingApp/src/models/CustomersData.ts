import type { AccountSummary } from "./accountSummary";

export interface CustomersData {
    customerId: string,
    customerName: string,
    mobile: string,
    email:  string,
    kycStatus: string,
    createdAt: string,
    accounts: AccountSummary[],
}