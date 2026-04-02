import { BrowserRouter, Route, Routes } from "react-router";
import NavBar from "./components/NavBar";
import TxnList from "./components/TxnList";
import TxnForm from "./components/TxnForm";

const App =() => (
  <BrowserRouter>
    <NavBar appTitle="AddressBook 2.0" />
    <div className="container-fluid p-4">
      <Routes>
        <Route path="/" element={<TxnList />}  />
        <Route path="/add" element={<TxnForm />}  />
        <Route path="/edit/:id" element={<TxnForm />}  />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;