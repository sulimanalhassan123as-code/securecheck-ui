import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import SecurityScanner from "./pages/SecurityScanner";
import TechnologyIntelligence from "./pages/TechnologyIntelligence";
import DomainIntelligence from "./pages/DomainIntelligence";
import ApiIntelligence from "./pages/ApiIntelligence";
import PaymentLab from "./pages/PaymentLab";
import SystemManagement from "./pages/SystemManagement";
import AiAssistant from "./pages/AiAssistant";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
       <Route path="/welcome" element={<Welcome />} /> 
<Route path="/scanner" element={<SecurityScanner />} />
        <Route path="/technology" element={<TechnologyIntelligence />} />
        <Route path="/domain" element={<DomainIntelligence />} />
        <Route path="/api" element={<ApiIntelligence />} />
        <Route path="/payment" element={<PaymentLab />} />
        <Route path="/system" element={<SystemManagement />} />
        <Route path="/ai" element={<AiAssistant />} />
      </Routes>
    </BrowserRouter>
  );
}
