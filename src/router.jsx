import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import SecurityScanner from "./pages/SecurityScanner";
import TechnologyIntelligence from "./pages/TechnologyIntelligence";
import DomainIntelligence from "./pages/DomainIntelligence";
import ApiIntelligence from "./pages/ApiIntelligence";
import SystemManagement from "./pages/SystemManagement";
import AiAssistant from "./pages/AiAssistant";
import CyberAI from "./pages/CyberAI";
import Community from "./pages/Community";
import AdminOps from "./pages/AdminOps";
import HelpContact from "./pages/HelpContact";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/scanner" element={<SecurityScanner />} />
        <Route path="/technology" element={<TechnologyIntelligence />} />
        <Route path="/domain" element={<DomainIntelligence />} />
        <Route path="/api" element={<ApiIntelligence />} />
        {/* Payment Lab card-checker moved inside Admin Ops — no public route anymore */}
        <Route path="/payment" element={<Navigate to="/admin-ops" replace />} />
        <Route path="/system" element={<SystemManagement />} />
        <Route path="/ai" element={<AiAssistant />} />
            <Route path="/cyber-ai" element={<CyberAI />} />
        <Route path="/community" element={<Community />} />
        <Route path="/help" element={<HelpContact />} />
        <Route path="/admin-ops" element={<AdminOps />} />
      </Routes>
    </BrowserRouter>
  );
}
