import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Differentiator } from "@/components/landing/Differentiator";
import { DemoPreview } from "@/components/landing/DemoPreview";
import { Testimonials } from "@/components/landing/Testimonials";
import { Segments } from "@/components/landing/Segments";
import { FAQ } from "@/components/landing/FAQ";
import { Waitlist } from "@/components/landing/Waitlist";
import { Footer } from "@/components/landing/Footer";

export default function Landing() {
  return (
    <div
      className="overflow-x-hidden bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100"
      data-testid="landing-page"
    >
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Features />
        <Differentiator />
        <DemoPreview />
        <Testimonials />
        <Segments />
        <FAQ />
        <Waitlist />
      </main>
      <Footer />
    </div>
  );
}
