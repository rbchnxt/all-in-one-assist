import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { useDatabase } from "@/hooks/use-supabase";
import { LoginPage } from "@/pages/login";
import { RegistrationPage } from "@/pages/registration";
import { DashboardPage } from "@/pages/dashboard";
import { DatabaseViewer } from "@/pages/database-viewer";
import { LoadingOverlay } from "@/components/loading-overlay";
import { useEffect, useState } from "react";
import type { Student } from "@shared/schema";
import NotFound from "@/pages/not-found";
// Import test data to create sample accounts
import "@/lib/test-data";

function AppRouter() {
  const { user, loading: authLoading } = useAuth();
  const { getStudent } = useDatabase();
  const [student, setStudent] = useState<Student | null>(null);
  const [checkingRegistration, setCheckingRegistration] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      checkUserRegistration();
    }
  }, [user, authLoading]);

  const checkUserRegistration = async () => {
    if (!user) return;
    
    setCheckingRegistration(true);
    try {
      const studentData = await getStudent(user.id);
      setStudent(studentData);
    } catch (error) {
      console.error('Failed to check registration:', error);
    } finally {
      setCheckingRegistration(false);
    }
  };

  if (authLoading || checkingRegistration) {
    return <LoadingOverlay isVisible={true} message="Loading EduVoice..." />;
  }

  return (
    <Switch>
      {/* Database viewer - accessible to everyone */}
      <Route path="/database" component={DatabaseViewer} />
      
      {/* Not authenticated - show login */}
      {!user && <Route path="/" component={LoginPage} />}
      
      {/* Authenticated but not registered - show registration */}
      {user && !student && <Route path="/" component={RegistrationPage} />}
      
      {/* Authenticated and registered - show dashboard */}
      {user && student && (
        <>
          <Route path="/" component={DashboardPage} />
          <Route path="/dashboard" component={DashboardPage} />
        </>
      )}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
