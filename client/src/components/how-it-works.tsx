import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Users, Home, Check } from "lucide-react";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Your 2% Closing Credits Work
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Arizona Home First connects qualified homebuyers with our network of licensed lenders and realtors who provide credits toward your closing costs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Step 1 */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-arizona-red rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Complete Your Profile</h3>
              <p className="text-gray-600 leading-relaxed">
                Answer our quick eligibility quiz and submit your contact information to get matched with our licensed professionals
              </p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-desert-blue rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Connected</h3>
              <p className="text-gray-600 leading-relaxed">
                We connect you with our network of licensed Arizona lenders and realtors who participate in our credit program
              </p>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-sage rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Receive Your Credits</h3>
              <p className="text-gray-600 leading-relaxed">
                At closing, receive 1% lender credit + 1% realtor credit applied toward your closing costs and fees
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Credit Breakdown */}
        <Card className="shadow-lg">
          <CardContent className="p-8 md:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Your 2% Credit Breakdown</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-arizona-red rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">1% Lender Credit</h4>
                    <p className="text-gray-600">Our network lenders provide a credit equal to 1% of your loan amount, applied directly to your closing costs.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-desert-blue rounded-lg flex items-center justify-center flex-shrink-0">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">1% Realtor Credit</h4>
                    <p className="text-gray-600">Our network realtors contribute 1% of the home price toward your closing costs through our buyer credit program.</p>
                  </div>
                </div>
              </div>

              {/* Example Calculation */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Example: $400,000 Home</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">1% Lender Credit:</span>
                    <span className="font-semibold">$4,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">1% Realtor Credit:</span>
                    <span className="font-semibold">$4,000</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold text-gray-900">Total Credits:</span>
                    <span className="font-bold text-arizona-red text-lg">$8,000</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  * Credits applied at closing toward allowable closing costs and fees
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
