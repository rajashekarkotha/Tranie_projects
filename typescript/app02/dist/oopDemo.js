class Employee {
    firstName;
    lastName;
    address;
    basicPay;
    constructor(firstName, lastName, address, basicPay) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.basicPay = basicPay;
    }
}
export class RegularEmployee extends Employee {
    tax;
    constructor(firstName, lastName, address, basicPay) {
        super(firstName, lastName, address, basicPay);
        this.tax = 500;
    }
    netPay() {
        return this.basicPay - this.tax;
    }
}
export class Manager extends RegularEmployee {
    hra;
    constructor(firstName, lastName, address, basicPay, hra) {
        super(firstName, lastName, address, basicPay);
        this.hra = hra;
    }
    netPay() {
        return this.basicPay + this.hra - this.tax;
    }
}
