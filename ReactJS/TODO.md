# Fixing 404 on POST /customers/CUST-10001/accounts

## Steps:
- [x] Step 1: Edit `budget-tracker-api/json-server.js` - Add POST `/customers/:customerId/accounts` handler
- [ ] Step 2: Restart json-server:
  ```
  cd budget-tracker-api && json-server --watch data.json --port 9999 --routes routes.json
  ```
- [ ] Step 3: Test in BudgetTrackingApp:
  - Open CustomerList
  - Expand CUST-10001
  - Click ADD Account, fill form, submit (no 404)
- [ ] Step 4: Verify new account appears in `budget-tracker-api/data.json` under CUST-10001.accounts
- [ ] Step 5: Mark complete
