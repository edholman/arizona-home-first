import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Home, Users, Shield } from "lucide-react";
import heroBackground from "@assets/PHX_1754437113168.webp";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative text-white overflow-hidden min-h-[80vh]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroBackground} 
          alt="Phoenix Arizona skyline at sunset" 
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex items-center min-h-[80vh]">
        <div className="flex justify-center w-full">
          <div className="max-w-4xl text-center space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                <Shield className="w-4 h-4" />
                <span>Arizona Home First Program</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your Path to <span className="text-yellow-300">Homeownership</span> in Arizona
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-100 leading-relaxed max-w-3xl mx-auto">
                First-time Arizona homebuyers may qualify for up to 2% in down payment or closing cost assistance. Check your eligibility today.
              </p>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={() => scrollToSection('eligibility')}
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 h-auto text-lg font-semibold shadow-lg"
              >
                Check If You Qualify
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
