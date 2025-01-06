import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Ship from "./pages/Ship";
import ShipForm from "./pages/ShipForm";
import ShipCalendar from "./pages/ShipCalendar";
import Inquire from "./pages/Inquire";
import OrderForMe from "./pages/OrderForMe";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/ship" element={<Layout><Ship /></Layout>} />
          <Route path="/ship/form" element={<Layout><ShipForm /></Layout>} />
          <Route path="/ship/calendar" element={<Layout><ShipCalendar /></Layout>} />
          <Route path="/inquire" element={<Layout><Inquire /></Layout>} />
          <Route path="/order-for-me" element={<Layout><OrderForMe /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;