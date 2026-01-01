import { motion } from "framer-motion";
import { ShieldCheck, Zap, Globe } from "lucide-react";

export function Hero() {
  return (
    <div className="relative py-12 md:py-20 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-accent mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Casper Network Testnet
          </div>
          
          <h1 className="text-4xl md:text-7xl font-display font-bold text-white mb-6 leading-tight tracking-tight">
            Next-Gen Blockchain <br />
            <span className="text-gradient animate-gradient bg-[length:200%_auto]">Loyalty Platform</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Secure, scalable, and transparent loyalty points management powered by the Casper Network. 
            Connect your wallet to experience the future of customer retention.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
        >
          {[
            { icon: ShieldCheck, title: "Enterprise Grade", desc: "Built on Casper's secure infrastructure" },
            { icon: Zap, title: "Instant Settlement", desc: "Real-time point issuance and redemption" },
            { icon: Globe, title: "Universal Access", desc: "Accessible from any compliant wallet" },
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-xl bg-card/40 border border-white/5 backdrop-blur-sm hover:bg-card/60 transition-colors">
              <item.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
