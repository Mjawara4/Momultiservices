import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Ship from "./pages/Ship";
import ShipForm from "./pages/ShipForm";
import OrderForMe from "./pages/OrderForMe";
import About from "./pages/About";
import Calendar from "./pages/Calendar";
import Inquire from "./pages/Inquire";
import TrackShipment from "./pages/TrackShipment";
import TrackingDetails from "./pages/TrackingDetails";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ship" element={<Ship />} />
          <Route path="/ship-form" element={<ShipForm />} />
          <Route path="/order-for-me" element={<OrderForMe />} />
          <Route path="/about" element={<About />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/inquire" element={<Inquire />} />
          <Route path="/track" element={<TrackShipment />} />
          <Route path="/track/:trackingNumber" element={<TrackingDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;