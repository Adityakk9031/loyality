import { ClickProvider, CsprClickThemes } from "@make-software/csprclick-ui";
import { ThemeProvider } from "styled-components";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { LoyaltyCard } from "@/components/LoyaltyCard";
import { motion } from "framer-motion";
import { Wallet, Coins, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useClickRef } from "@make-software/csprclick-ui";

export default function Dashboard() {
  const { toast } = useToast();
  const clickRef = useClickRef();
  const activeAccount = clickRef?.activeAccount;

  const issuePointsMutation = useMutation({
    mutationFn: async (data: { userAddress: string; amount: string }) => {
      const res = await apiRequest("POST", "/api/issue-points", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Points Issued",
        description: `Successfully issued points. Transaction: ${data.deployHash.slice(0, 10)}...`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/issue-points"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleConnect = () => {
    clickRef?.signIn();
  };

  return (
    <ThemeProvider theme={CsprClickThemes.light}>
      <div className="min-h-screen bg-background relative selection:bg-primary/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <Navigation />

        <main className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Hero />

          <div className="mt-12 max-w-4xl mx-auto space-y-8">
            {activeAccount ? (
              <>
                <LoyaltyCard 
                  userAddress={activeAccount.public_key} 
                  points={1250} 
                />
                
                <div className="flex justify-center">
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Claiming Points",
                        description: "Requesting loyalty point issuance on Casper Network...",
                      });
                      issuePointsMutation.mutate({
                        userAddress: activeAccount.public_key,
                        amount: "100"
                      });
                    }}
                    disabled={issuePointsMutation.isPending}
                    size="lg"
                    className="bg-primary text-primary-foreground hover-elevate active-elevate-2 font-semibold px-8"
                  >
                    {issuePointsMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Coins className="mr-2 h-4 w-4" />
                    )}
                    Claim 100 Points
                  </Button>
                </div>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center py-12 px-6 rounded-2xl border border-dashed border-white/10 bg-card/20 backdrop-blur-sm"
              >
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Wallet className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Wallet Not Connected</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Please connect your Casper wallet to view your loyalty points balance and access merchant features.
                </p>
                <Button 
                  onClick={handleConnect}
                  size="lg"
                  className="bg-white text-background hover:bg-gray-200 font-semibold px-8"
                >
                  Connect Wallet
                </Button>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
