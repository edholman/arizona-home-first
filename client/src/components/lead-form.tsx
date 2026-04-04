import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertLeadSchema } from "@shared/schema";
import { useQuizData } from "@/hooks/use-quiz-data";
import { trackConversion, trackLeadFormStart, trackLeadFormFieldInteraction, trackLeadFormAbandonment } from "@/lib/analytics";

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    timeline: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [formStarted, setFormStarted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const { quizData, clearQuizData } = useQuizData();

  // Track form abandonment when user leaves without submitting
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (formStarted && !showSuccess) {
        trackLeadFormAbandonment();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formStarted, showSuccess]);

  const leadMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Include quiz data if available
      const leadDataWithQuiz = {
        ...data,
        quizAnswers: quizData
      };
      const validatedData = insertLeadSchema.parse(leadDataWithQuiz);
      const response = await apiRequest("POST", "/api/leads", validatedData);
      return response.json();
    },
    onSuccess: (data) => {
      setShowSuccess(true);
      // Clear quiz data after successful submission
      clearQuizData();
      toast({
        title: "Success!",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Track Google Ads conversion on button click
    trackConversion();
    leadMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    // Track form start on first interaction
    if (!formStarted) {
      setFormStarted(true);
      trackLeadFormStart();
    }
    
    // Track field interaction
    trackLeadFormFieldInteraction(field);
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (showSuccess) {
    return (
      <section id="contact" className="py-20 bg-gradient-to-br from-terracotta to-arizona-red text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white text-gray-900">
            <CardContent className="p-8 md:p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Thank You!</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <p className="text-green-800 mb-4">
                  <strong>Your Arizona Homebuyer Credit Guide is on its way!</strong>
                </p>
                <p className="text-green-700">
                  Check your email for your personalized guide with next steps. One of our licensed professionals will contact you within 24 hours to discuss your homebuying goals.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-terracotta to-arizona-red text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Arizona Homebuyer Waitlist
          </h2>
          <p className="text-xl text-red-100">
            Complete your application to be considered for our program. We'll notify you when spots become available.
          </p>
        </div>

        <Card className="bg-white text-gray-900">
          <CardContent className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Smith"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john.smith@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
              </div>



              <div>
                <Label htmlFor="timeline">When are you looking to buy?</Label>
                <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">ASAP</SelectItem>
                    <SelectItem value="1-3-months">1-3 months</SelectItem>
                    <SelectItem value="3-6-months">3-6 months</SelectItem>
                    <SelectItem value="6-plus-months">6+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit"
                className="w-full bg-arizona-red text-white hover:bg-red-700 py-4 h-auto text-lg font-semibold"
                disabled={leadMutation.isPending}
              >
                {leadMutation.isPending ? "Submitting..." : "Join Our Waitlist"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
