import { CsprClickUI, ClickProvider } from "@make-software/csprclick-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Coins, Wallet } from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();

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

  return (
    <ClickProvider options={{ 
      appName: "Casper Loyalty",
      providers: ["casper-wallet", "casper-signer", "casper-dash-wallet"],
      network: "casper-test"
    }}>
      <div className="p-6 space-y-6">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Loyalty Dashboard</h1>
            <p className="text-muted-foreground">Manage your Casper loyalty points</p>
          </div>
          <CsprClickUI />
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Hash</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate">
                {/* Account hash will be shown here after wallet connection */}
                Connect Wallet
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loyalty Balance</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0 CSPR-L</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button 
              onClick={() => {
                // In a real app, we'd get the address from CSPR.click context
                toast({
                  title: "Claiming Points",
                  description: "Simulating loyalty point issuance...",
                });
                issuePointsMutation.mutate({
                  userAddress: "01c901e1864190c1032df49d5c19793132d78d91b45da81258667c4ec113b69324",
                  amount: "100"
                });
              }}
              disabled={issuePointsMutation.isPending}
            >
              {issuePointsMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Coins className="mr-2 h-4 w-4" />
              )}
              Claim 100 Points
            </Button>
          </CardContent>
        </Card>
      </div>
    </ClickProvider>
  );
}
