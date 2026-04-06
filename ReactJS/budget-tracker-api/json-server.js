const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router("data.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

/* ✅ Test route */
server.get("/health", (req, res) => {
  res.json({ status: "UP" });
});

server.post("/customers", (req, res) => {
  const db = router.db;
  // const customers = db.get("customerSummary").value();
  const newCustomer = req.body;
  console.log("Received new customer data: ", req.body);
  // const newCustomerId =
  //   customers.length > 0
  //     ? Math.max(...customers.map(c => c.customerId)) + 1
  //     : 1;
  const customerToSave = {
    customerId: newCustomer.customerId,
    customerName: newCustomer.customerName,
    email: newCustomer.email,
    mobile: newCustomer.mobile,
    accounts: []
  };
  db.get("customerSummary").push(customerToSave).write();
  res.status(201).json(customerToSave);

});

/* ✅ Custom route for customer-specific accounts */
server.post("/customers/:customerId/accounts", (req, res) => {
  const { customerId } = req.params;
  const newAccountData = req.body;
  const db = router.db;
  const customers = db.get("customerSummary").value();
  const customer = customers.find(c => c.customerId === customerId);
  
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }
  
  const newAccountId = newAccountData.accountId || `ACC-${Date.now()}`;
  const accountToSave = {
    accountId: newAccountId,
    accountNumber: newAccountData.accountNumber,
    bankName: newAccountData.bankName,
    accountType: newAccountData.accountType,
    currency: "INR",
    status: "ACTIVE",
    Txns: [],
    summary: { totalCredit: 0, totalDebit: 0, balance: 0, lastUpdated: new Date().toISOString() }
  };
  
  customer.accounts.push(accountToSave);
  db.write();
  res.status(201).json(accountToSave);
});

server.post("/accounts", (req, res) => {
  const newAccount = req.body;
  const db = router.db;
  const customers = db.get("customerSummary").value(); 
  const customer = customers[0]; // Assuming single customer for simplicity

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }
  // ✅ Auto-generate account ID
  const newAccountId =
    customer.accounts.length > 0
      ? Math.max(...customer.accounts.map(acc => acc.accountId)) + 1
      : 1;
  const accountToSave = {
    accountId: newAccountId,
    ...newAccount,
    Txns: []
  };  
  customer.accounts.push(accountToSave);
  db.write();
  res.status(201).json(accountToSave);
});

/* ✅ Custom account route */
server.get("/accounts/:accountId", (req, res) => {
  const { accountId } = req.params;
  const customers = router.db.get("customerSummary").value();

  for (const customer of customers) {
    const account = customer.accounts.find(
      acc => acc.accountId === accountId
    );
    if (account) {
      return res.json(account);
    }
  }

  res.status(404).json({ message: "Account not found" });
});

server.post("/accounts/:accountId/txns", (req, res) => {
  const { accountId } = req.params;
  const newTxn = req.body;

  const db = router.db;
  const customers = db.get("customerSummary").value();

  for (const customer of customers) {
    const account = customer.accounts.find(
      acc => acc.accountId === accountId
    );

    if (account) {
      // ✅ Auto-generate transaction ID
      const newId =
        account.Txns.length > 0
          ? Math.max(...account.Txns.map(txn => txn.id)) + 1
          : 1;

      const txnToSave = {
        id: newId,
        ...newTxn
      };

      account.Txns.push(txnToSave);
      
      if(account.summary) {
      /* Optional: update summary */
             account.summary.totalCredit = account.Txns
          .filter(txn => txn.txnType === "CREDIT")
          .reduce((sum, txn) => sum + txn.amount, 0);
        account.summary.totalDebit = account.Txns
          .filter(txn => txn.txnType === "DEBIT")
          .reduce((sum, txn) => sum + txn.amount, 0);
        account.summary.balance = account.summary.totalCredit - account.summary.totalDebit;
      account.summary.lastUpdated = newTxn.txnDate;
      }
      // ✅ Persist to db.json
      db.write();

    //   return res.status(201).json(txnToSave);
        return res.status(201).json(account);
    }
  }

  res.status(404).json({ message: "Account not found" });
});

server.put("/accounts/:accountId/txns/:txnId", (req, res) => {
  const { accountId, txnId } = req.params;
  const updatedData = req.body;
  const db = router.db;
  const customers = db.get("customerSummary").value();
    for (const customer of customers) {
    const account = customer.accounts.find(
      acc => acc.accountId === accountId
    );  
    if (account) {
      const txnIndex = account.Txns.findIndex(
        txn => txn.id === Number(txnId)
      );
        if (txnIndex === -1) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        // ✅ Update transaction
        account.Txns[txnIndex] = { ...account.Txns[txnIndex], ...updatedData };
        // ✅ Persist change to db.json
         if(account.summary) {
      /* Optional: update summary */
             account.summary.totalCredit = account.Txns
          .filter(txn => txn.txnType === "CREDIT")
          .reduce((sum, txn) => sum + txn.amount, 0);
        account.summary.totalDebit = account.Txns
          .filter(txn => txn.txnType === "DEBIT")
          .reduce((sum, txn) => sum + txn.amount, 0);
        account.summary.balance = account.summary.totalCredit - account.summary.totalDebit;
        account.summary.lastUpdated = new Date().toISOString();
      }
        db.write();
        // return res.json(account.Txns[txnIndex]);
        return res.json(account);
    }
    }       
    res.status(404).json({ message: "Account not found" });
});

server.delete("/accounts/:accountId/txns/:txnId", (req, res) => {
  const { accountId, txnId } = req.params;
  const db = router.db;
  const customers = db.get("customerSummary").value();

  for (const customer of customers) {
    const account = customer.accounts.find(
      acc => acc.accountId === accountId
    );

    if (account) {
      const index = account.Txns.findIndex(
        txn => txn.id === Number(txnId)
      );

      if (index === -1) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      account.Txns.splice(index, 1);

    if (account.summary) {
        // Recalculate summary after deletion
        account.summary.totalCredit = account.Txns
          .filter(txn => txn.txnType === "CREDIT")
          .reduce((sum, txn) => sum + txn.amount, 0);
        account.summary.totalDebit = account.Txns
          .filter(txn => txn.txnType === "DEBIT")
          .reduce((sum, txn) => sum + txn.amount, 0);
        account.summary.balance = account.summary.totalCredit - account.summary.totalDebit;
        account.summary.lastUpdated = new Date().toISOString();
      }
      
      db.write();

      return res.json(account);
    }
  }

  res.status(404).json({ message: "Account not found" });
});

/* ✅ THIS LINE IS CRITICAL */
server.use(router);

/* ✅ Start server */
server.listen(9999, () => {
  console.log("✅ JSON Server running at http://localhost:9999");
});