import { Shield, Users, TrendingUp, Heart } from "lucide-react";

export default function AboutUs() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            About Arizona Home First
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're an organization dedicated to helping first-time homebuyers navigate Arizona's challenging real estate market. In today's difficult housing environment, we believe everyone deserves access to homeownership opportunities and the financial assistance to make it possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Our Mission
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Arizona's housing market has become increasingly challenging for first-time buyers, with rising prices and competitive bidding wars. We recognized that many qualified buyers were being priced out despite having good credit and stable income.
            </p>
            <p className="text-gray-600 leading-relaxed">
              That's why we created Arizona Home First - to level the playing field by connecting you with licensed professionals who offer meaningful financial credits toward your closing costs, making homeownership more accessible and affordable.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-arizona-red/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-arizona-red" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Licensed Network</h4>
              <p className="text-sm text-gray-600">Vetted lenders and realtors committed to helping first-time buyers</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-arizona-red/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-arizona-red" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">RESPA Compliant</h4>
              <p className="text-sm text-gray-600">All credits follow federal and state real estate regulations</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-arizona-red/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-arizona-red" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Up to 2% Credits</h4>
              <p className="text-sm text-gray-600">Combined lender and realtor credits applied at closing</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-arizona-red/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-arizona-red" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">First-Time Focus</h4>
              <p className="text-sm text-gray-600">Specifically designed for Arizona first-time homebuyers</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Why This Matters Now
            </h3>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Rising Home Prices</h4>
                <p className="text-gray-600 text-sm">
                  Arizona home prices have increased significantly, making it harder for first-time buyers to save for down payments and closing costs.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Competitive Market</h4>
                <p className="text-gray-600 text-sm">
                  Cash offers and bidding wars have made it challenging for traditional buyers to compete, especially when funds are tight.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Credit Solutions</h4>
                <p className="text-gray-600 text-sm">
                  Our network provides up to 2% in combined credits, giving you more buying power and reducing your out-of-pocket expenses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}