import { motion } from "framer-motion";
import { Coins, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useIssuePoints } from "@/hooks/use-casper";

interface LoyaltyCardProps {
  userAddress: string;
  points: number;
}

export function LoyaltyCard({ userAddress, points }: LoyaltyCardProps) {
  const { mutate: issuePoints, isPending } = useIssuePoints();

  const handleClaim = () => {
    issuePoints({ userAddress, amount: 10 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
        
        <Card className="relative p-8 rounded-2xl glass-panel border-0 overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Coins className="w-64 h-64 rotate-12" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="text-sm font-medium text-muted-foreground tracking-wider uppercase">Current Balance</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-2 tracking-tight">
                {points.toLocaleString()} <span className="text-2xl text-muted-foreground/60 font-normal">PTS</span>
              </h2>
              
              <p className="text-sm text-muted-foreground">
                Connected: <span className="font-mono text-xs bg-black/30 px-2 py-1 rounded text-primary-foreground/80">{userAddress.slice(0, 10)}...{userAddress.slice(-10)}</span>
              </p>
            </div>

            <div className="w-full md:w-auto">
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-white/5 shadow-inner">
                <h3 className="text-lg font-semibold text-white mb-4">Simulate Merchant Action</h3>
                <Button 
                  size="lg"
                  onClick={handleClaim}
                  disabled={isPending}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity border-0 shadow-lg shadow-primary/20 text-white font-semibold h-12 text-base"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Coins className="mr-2 h-5 w-5" />
                      Claim 10 Points
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Triggers an on-chain `issue_points` transaction via backend
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
