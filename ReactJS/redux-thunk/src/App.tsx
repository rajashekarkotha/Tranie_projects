import { BrowserRouter, Route, Routes } from "react-router";
import NavBar from "./components/NavBar";
import ContactsList from "./components/ContactsList";
import ContactForm from "./components/ContactsForm";

const App =() => (
  <BrowserRouter>
    <NavBar appTitle="AddressBook 2.0" />
    <div className="container-fluid p-4">
      <Routes>
        <Route path="/" element={<ContactsList />}  />
        <Route path="/add" element={<ContactForm />}  />
        <Route path="/edit/:id" element={<ContactForm />}  />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;