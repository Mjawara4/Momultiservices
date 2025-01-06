import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Ship from "./pages/Ship";
import ShipForm from "./pages/ShipForm";
import Calendar from "./pages/Calendar";
import Inquire from "./pages/Inquire";
import OrderForMe from "./pages/OrderForMe";
import { Toaster } from "./components/ui/toaster";
import "./App.css";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ship" element={<Ship />} />
          <Route path="/ship-form" element={<ShipForm />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/order-for-me" element={<OrderForMe />} />
          <Route path="/inquire" element={<Inquire />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;