import { BrowserRouter, Route, Routes } from "react-router";
import NavBar from "./components/NavBar";
import CustomerList from "./components/CustomerList";
import StatementOfAccount from "./components/StatementOfAccount";

const App =() => (
  <BrowserRouter>
    <NavBar appTitle="Budget Trcker App" />
    <div className="container-fluid p-4">
      <Routes>
        <Route path="/" element={<CustomerList />}  />
        <Route path="/edit/:id" element={<StatementOfAccount />}  />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;