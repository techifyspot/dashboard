import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SsoCallback from "./pages/SsoCallback";
import Dashboard from "./pages/Dashboard";
import Overview from "./pages/dashboard/Overview";
import AICodingAssistant from "./pages/dashboard/AICodingAssistant";
import ProjectManagement from "./pages/dashboard/ProjectManagement";
import Automation from "./pages/dashboard/Automation";
import Analytics from "./pages/dashboard/Analytics";
import CodeTools from "./pages/dashboard/CodeTools";
import CodeOptimization from "./pages/dashboard/CodeOptimization";
import VersionControl from "./pages/dashboard/VersionControl";
import Collaboration from "./pages/dashboard/Collaboration";
import Settings from "./pages/dashboard/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/login" replace />
      </SignedOut>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <>
              <SignedIn>
                <Navigate to="/dashboard" replace />
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" replace />
              </SignedOut>
            </>
          } />
          <Route path="/login" element={
            <>
              <SignedIn>
                <Navigate to="/dashboard" replace />
              </SignedIn>
              <SignedOut>
                <Login />
              </SignedOut>
            </>
          } />
          <Route path="/signup" element={
            <>
              <SignedIn>
                <Navigate to="/dashboard" replace />
              </SignedIn>
              <SignedOut>
                <Signup />
              </SignedOut>
            </>
          } />
          <Route path="/forgot-password" element={
            <>
              <SignedIn>
                <Navigate to="/dashboard" replace />
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" replace />
              </SignedOut>
            </>
          } />
          <Route path="/sso-callback" element={<SsoCallback />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
            <Route index element={<Overview />} />
            <Route path="ai-assistant" element={<AICodingAssistant />} />
            <Route path="code-tools" element={<CodeTools />} />
            <Route path="code-optimization" element={<CodeOptimization />} />
            <Route path="projects" element={<ProjectManagement />} />
            <Route path="automation" element={<Automation />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="version-control" element={<VersionControl />} />
            <Route path="collaboration" element={<Collaboration />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
