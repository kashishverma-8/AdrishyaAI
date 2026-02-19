import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Report from "./pages/Report";
import Voice from "./pages/Voice";
import Chat from "./pages/Chat";
import Heatmap from "./pages/Heatmap";
import Salary from "./pages/Salary";
import Legal from "./pages/Legal";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Impact from "./pages/Impact";
import Security from "./pages/Security";
import SavedResources from "./pages/SavedResources";




const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/report" element={<Report />} />
          <Route path="/voice" element={<Voice />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/salary" element={<Salary />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/security" element={<Security />} />
          <Route path="/saved-resources" element={<SavedResources />} />



        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
