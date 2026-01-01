import { WalletConnect } from "./WalletConnect";
import { Link } from "wouter";
import { Layers } from "lucide-react";

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight text-white leading-none">
                Casper<span className="text-accent">Loyalty</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1">
                Enterprise LaaS
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
}
