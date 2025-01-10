import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Ship from "./pages/Ship";
import ShipForm from "./pages/ShipForm";
import ShipCalendar from "./pages/ShipCalendar";
import Inquire from "./pages/Inquire";
import OrderForMe from "./pages/OrderForMe";
import About from "./pages/About";
import TrackShipment from "./pages/TrackShipment";
import TrackingDetails from "./pages/TrackingDetails";
import ManageTracking from "./pages/admin/ManageTracking";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ship" element={<Ship />} />
            <Route path="/ship/form" element={<ShipForm />} />
            <Route path="/ship/calendar" element={<ShipCalendar />} />
            <Route path="/inquire" element={<Inquire />} />
            <Route path="/order-for-me" element={<OrderForMe />} />
            <Route path="/about" element={<About />} />
            <Route path="/track" element={<TrackShipment />} />
            <Route path="/track/:trackingNumber" element={<TrackingDetails />} />
            <Route path="/admin/tracking" element={<ManageTracking />} />
          </Routes>
        </Layout>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;