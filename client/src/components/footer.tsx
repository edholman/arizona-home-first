import { Phone, Mail, Home } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-arizona-red rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold">Arizona Home First</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Connecting Arizona homebuyers with licensed lenders and realtors who provide credits toward closing costs.
            </p>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5" />
                <span>(480) 526-4115</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5" />
                <span>info@arizonahomefirst.org</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Programs</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">First-Time Buyer Credits</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Down Payment Assistance</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Closing Cost Credits</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Eligibility Requirements</a></li>
            </ul>
          </div>


        </div>

        {/* Legal Disclaimers */}
        <div className="border-t border-gray-800 pt-8">
          <div className="space-y-4 text-sm text-gray-400">
            <p>
              <strong>Important Disclaimer:</strong> Arizona Home First is a marketing platform that connects homebuyers with licensed lenders and real estate professionals. We are not a lender, real estate broker, or government agency. Credits are provided by participating licensed professionals in our network and applied at closing toward allowable closing costs and fees. Not a government grant program.
            </p>
            <p>
              <strong>RESPA Compliance:</strong> All credits are provided independently by licensed professionals as part of their normal business practices. No referral fees or kickbacks are exchanged between lenders and real estate agents. All arrangements comply with federal and state real estate settlement procedures.
            </p>
            <p>
              <strong>Licensing:</strong> All lenders in our network are licensed by the Arizona Department of Financial Institutions and/or federal banking regulators. Real estate professionals are licensed by the Arizona Department of Real Estate. NMLS Consumer Access: www.nmlsconsumeraccess.org
            </p>
            <p>
              <strong>Program Terms:</strong> Credit amounts and eligibility requirements are subject to individual lender and realtor program terms. Not all applicants will qualify. Credits cannot exceed actual closing costs and fees. Program availability and terms may vary and are subject to change without notice.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-8 border-t border-gray-800">
            <div className="text-gray-500 text-sm">
              © 2024 Arizona Home First. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Equal Housing Opportunity</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
