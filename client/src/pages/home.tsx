import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import EligibilityQuiz from "@/components/eligibility-quiz";
import AboutUs from "@/components/about-us";
import HowItWorks from "@/components/how-it-works";
import SavingsCalculator from "@/components/savings-calculator";
import LeadForm from "@/components/lead-form";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <EligibilityQuiz />
      <AboutUs />
      <HowItWorks />
      <SavingsCalculator />
      <LeadForm />
      <Footer />
    </div>
  );
}
