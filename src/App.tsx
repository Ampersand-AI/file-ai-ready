import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import Index from "./pages/Index";
import DocumentsPage from "./pages/DocumentsPage";
import UploadsPage from "./pages/UploadsPage";
import CompliancePage from "./pages/CompliancePage";
import FilingPage from "./pages/FilingPage";
import NotFound from "./pages/NotFound";
import APIToggle from "./components/APIToggle";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/wizard" element={<Index />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/uploads" element={<UploadsPage />} />
            <Route path="/compliance" element={<CompliancePage />} />
            <Route path="/filing" element={<FilingPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        {/* API Toggle for development only - only visible in dev mode */}
        <APIToggle />
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
