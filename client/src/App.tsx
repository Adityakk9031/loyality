import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClickProvider } from "@make-software/csprclick-ui";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";

// Casper Click Provider Configuration
const clickSettings = {
  appName: "Casper Loyalty LaaS",
  appId: "casper-loyalty-app",
  contentMode: "iframe",
  providers: [
    "casper-wallet",
    "ledger",
    "torus",
    "casper-signer",
    "metamask-snap",
  ],
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    // Wrap with Casper Wallet Provider
    // @ts-ignore - types for ClickProvider can be tricky with different React versions
    <ClickProvider options={clickSettings}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClickProvider>
  );
}

export default App;
