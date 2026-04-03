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