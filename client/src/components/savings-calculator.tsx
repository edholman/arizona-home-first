import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SavingsCalculator() {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanAmount, setLoanAmount] = useState(320000);
  const [lenderCredit, setLenderCredit] = useState(3200);
  const [realtorCredit, setRealtorCredit] = useState(4000);
  const [totalCredits, setTotalCredits] = useState(7200);

  useEffect(() => {
    const downPaymentAmount = homePrice * (downPaymentPercent / 100);
    const newLoanAmount = homePrice - downPaymentAmount;
    const newLenderCredit = newLoanAmount * 0.01; // 1% of loan amount
    const newRealtorCredit = homePrice * 0.01; // 1% of home price
    const newTotalCredits = newLenderCredit + newRealtorCredit;

    setLoanAmount(newLoanAmount);
    setLenderCredit(newLenderCredit);
    setRealtorCredit(newRealtorCredit);
    setTotalCredits(newTotalCredits);
  }, [homePrice, downPaymentPercent]);

  const scrollToLeadForm = () => {
    const section = document.getElementById('contact');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section id="calculator" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Calculate Your Potential Savings
          </h2>
          <p className="text-xl text-gray-600">
            See exactly how much you could save with our 2% homebuyer credit program
          </p>
        </div>

        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="home-price" className="text-sm font-medium text-gray-700 mb-2 block">
                    Expected Home Price
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="home-price"
                      type="number"
                      value={homePrice}
                      onChange={(e) => setHomePrice(Number(e.target.value) || 0)}
                      className="pl-8"
                      placeholder="400,000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="down-payment" className="text-sm font-medium text-gray-700 mb-2 block">
                    Down Payment Percentage
                  </Label>
                  <Select value={downPaymentPercent.toString()} onValueChange={(value) => setDownPaymentPercent(Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3% (FHA/Conventional)</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="15">15%</SelectItem>
                      <SelectItem value="20">20%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-600 mb-2">Your loan amount will be:</div>
                    <div className="text-xl font-semibold text-gray-900">{formatCurrency(loanAmount)}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Results Panel */}
              <Card className="bg-white shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Your Credit Breakdown</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-gray-600">1% Lender Credit:</span>
                      <span className="font-semibold text-arizona-red">{formatCurrency(lenderCredit)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-gray-600">1% Realtor Credit:</span>
                      <span className="font-semibold text-desert-blue">{formatCurrency(realtorCredit)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-semibold text-gray-900">Total Credits:</span>
                      <span className="text-2xl font-bold text-green-600">{formatCurrency(totalCredits)}</span>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="text-center">
                      <div className="text-sm text-green-700 mb-1">You could save</div>
                      <div className="text-3xl font-bold text-green-800">{formatCurrency(totalCredits)}</div>
                      <div className="text-sm text-green-600">on your closing costs</div>
                    </div>
                  </div>

                  <Button 
                    onClick={scrollToLeadForm}
                    className="w-full bg-arizona-red text-white hover:bg-red-700 py-4 h-auto font-semibold"
                  >
                    Get My Personalized Quote
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
