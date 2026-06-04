import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SecurityScanner from "./pages/SecurityScanner";
import TechnologyIntelligence from "./pages/TechnologyIntelligence";
import DomainIntelligence from "./pages/DomainIntelligence";
import ApiIntelligence from "./pages/ApiIntelligence";
import PaymentLab from "./pages/PaymentLab";
import SystemManagement from "./pages/SystemManagement";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scanner" element={<SecurityScanner />} />
        <Route path="/technology" element={<TechnologyIntelligence />} />
        <Route path="/domain" element={<DomainIntelligence />} />
        <Route path="/api" element={<ApiIntelligence />} />
        <Route path="/payment" element={<PaymentLab />} />
        <Route path="/system" element={<SystemManagement />} />
      </Routes>
    </BrowserRouter>
  );
}
