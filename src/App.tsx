import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { LoginForm } from "@/components/LoginForm";
import Index from "./pages/Index";
import Alerts from "./pages/Alerts";
import Matches from "./pages/Matches";
import MapView from "./pages/MapView";
import Inventory from "./pages/Inventory";
import DonorProfile from "./pages/DonorProfile";
import NotFound from "./pages/NotFound";
import NearbyBloodBanks from "./pages/BloodBanks";
import AlertNearMe from "./pages/AlertNearMe"; 
import { HelpRequestProvider } from "./context/HelpRequestContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <HelpRequestProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/map" element={<MapView />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/profile" element={<DonorProfile />} />
                <Route path="/BloodBanks" element={<NearbyBloodBanks />} />
                <Route path="/nearby-alerts" element={<AlertNearMe />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </HelpRequestProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
