import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Differentiator } from "@/components/landing/Differentiator";
import { DemoPreview } from "@/components/landing/DemoPreview";
import { Segments } from "@/components/landing/Segments";
import { Waitlist } from "@/components/landing/Waitlist";
import { Footer } from "@/components/landing/Footer";

export default function Landing() {
  return (
    <div className="bg-stone-50 text-stone-900 overflow-x-hidden" data-testid="landing-page">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Features />
        <Differentiator />
        <DemoPreview />
        <Segments />
        <Waitlist />
      </main>
      <Footer />
    </div>
  );
}
