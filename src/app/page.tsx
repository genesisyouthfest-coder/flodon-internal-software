import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-white selection:text-black antialiased">
      <header className="flex h-20 items-center justify-between px-6 md:px-12 border-b border-border/50">
        <div className="flex items-center gap-2">
           <span className="text-xl font-bold tracking-tighter uppercase">Flodon</span>
        </div>
        <nav className="flex gap-8">
           <Link href="/login" className="text-[11px] font-bold hover:text-muted-foreground transition-colors uppercase tracking-[0.1em]">CRM LOGIN</Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-6xl mx-auto space-y-16 py-32">
        <div className="space-y-8">
          <h1 className="text-5xl md:text-[80px] font-extrabold tracking-tighter leading-[0.9] uppercase max-w-[12ch] mx-auto">
            We automate the work that slows you down.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
            Flodon builds highly precise AI systems that replace repetitive manual 
            workflows, intelligently convert more leads, and autonomously run your 
            core business operations while you focus on scaling.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
           <a 
             href="https://calendly.com/sanskarkolekarr/flodon" 
             target="_blank" 
             rel="noopener noreferrer"
             className="inline-flex h-14 items-center justify-center bg-primary text-primary-foreground px-10 text-xs font-bold uppercase tracking-[0.1em] rounded-md hover:bg-primary/90 transition-all active:scale-[0.98]"
           >
             Book Your Free Call
           </a>
           
           <Link 
             href="/login"
             className="inline-flex h-14 items-center justify-center border border-border bg-background px-10 text-xs font-bold uppercase tracking-[0.1em] rounded-md hover:bg-muted transition-all active:scale-[0.98]"
           >
             Access CRM
           </Link>
        </div>

        <div className="pt-20 space-y-12">
           <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
             Not a software tool. An execution partner.
           </p>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 opacity-30 select-none">
              <div className="space-y-1">
                <p className="text-2xl font-bold">48hrs</p>
                <p className="text-[10px] font-bold uppercase tracking-widest">Time to live</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-[10px] font-bold uppercase tracking-widest">Autonomous</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">$0</p>
                <p className="text-[10px] font-bold uppercase tracking-widest">Wasted Retainers</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">Global</p>
                <p className="text-[10px] font-bold uppercase tracking-widest">Delivery</p>
              </div>
           </div>
        </div>
      </main>

      <footer className="h-32 flex flex-col items-center justify-center border-t border-border/50 px-6 space-y-4">
         <p className="text-[10px] font-bold text-muted-foreground tracking-[0.1em] uppercase">
           AI VOICE AGENTS · AI CHATBOTS · WHATSAPP AUTOMATION · PERSONAL BRANDING · WEBSITE AI · LEAD CONVERSION · 24/7 AUTOMATION
         </p>
         <p className="text-[9px] font-medium text-muted-foreground uppercase opacity-50 tracking-widest">
           © 2025 Flodon · Worldwide · flodon.in
         </p>
      </footer>
    </div>
  );
}
