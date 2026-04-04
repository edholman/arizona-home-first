import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Home } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-arizona-red rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Arizona Home First</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-600 hover:text-arizona-red transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('eligibility')}
              className="text-gray-600 hover:text-arizona-red transition-colors"
            >
              Check Eligibility
            </button>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="bg-arizona-red text-white hover:bg-red-700"
            >
              Get Started
            </Button>
          </div>
          
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-left text-gray-600 hover:text-arizona-red transition-colors py-2"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('eligibility')}
                className="text-left text-gray-600 hover:text-arizona-red transition-colors py-2"
              >
                Check Eligibility
              </button>
              <Button 
                onClick={() => scrollToSection('contact')}
                className="bg-arizona-red text-white hover:bg-red-700 justify-start"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
