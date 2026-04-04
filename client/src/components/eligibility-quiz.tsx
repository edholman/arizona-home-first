import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQuizData } from "@/hooks/use-quiz-data";
import { trackQuizStart, trackQuizProgress, trackQuizComplete } from "@/lib/analytics";

interface QuizAnswers {
  firstTimeBuyer?: string;
  creditScore?: string;
  income?: string;
  priceRange?: string;
  downPaymentNeed?: string;
}

const questions = [
  {
    id: 1,
    question: "Are you a first-time homebuyer in Arizona?",
    key: "firstTimeBuyer" as keyof QuizAnswers,
    options: [
      { value: "yes", label: "Yes, this will be my first home purchase" },
      { value: "no", label: "No, I have owned a home before" }
    ]
  },
  {
    id: 2,
    question: "What's your estimated credit score?",
    key: "creditScore" as keyof QuizAnswers,
    options: [
      { value: "740+", label: "740+ (Excellent)" },
      { value: "680-739", label: "680-739 (Good)" },
      { value: "620-679", label: "620-679 (Fair)" },
      { value: "below-620", label: "Below 620" }
    ]
  },
  {
    id: 3,
    question: "What's your household annual income?",
    key: "income" as keyof QuizAnswers,
    options: [
      { value: "100k+", label: "$100,000+" },
      { value: "70k-99k", label: "$70,000 - $99,999" },
      { value: "50k-69k", label: "$50,000 - $69,999" },
      { value: "below-50k", label: "Below $50,000" }
    ]
  },
  {
    id: 4,
    question: "What's your target home price range?",
    key: "priceRange" as keyof QuizAnswers,
    options: [
      { value: "400k+", label: "$400,000+" },
      { value: "300k-399k", label: "$300,000 - $399,999" },
      { value: "200k-299k", label: "$200,000 - $299,999" },
      { value: "below-200k", label: "Below $200,000" }
    ]
  },
  {
    id: 5,
    question: "How much down payment assistance do you need?",
    key: "downPaymentNeed" as keyof QuizAnswers,
    options: [
      { value: "20k+", label: "$20,000+" },
      { value: "10k-19k", label: "$10,000 - $19,999" },
      { value: "5k-9k", label: "$5,000 - $9,999" },
      { value: "below-5k", label: "Less than $5,000" }
    ]
  }
];

export default function EligibilityQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [showResults, setShowResults] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const { toast } = useToast();
  const { saveQuizData } = useQuizData();

  const quizMutation = useMutation({
    mutationFn: async (quizData: QuizAnswers) => {
      const response = await apiRequest("POST", "/api/quiz", quizData);
      return response.json();
    },
    onSuccess: (data) => {
      setIsEligible(data.eligible);
      setShowResults(true);
      // Save quiz data to localStorage for use in lead form
      saveQuizData(answers);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process quiz results. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Track when quiz starts (first interaction)
  useEffect(() => {
    if (currentQuestion === 1 && Object.keys(answers).length === 0) {
      // Quiz component is visible, track start when user first loads this section
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackQuizStart();
            observer.disconnect();
          }
        });
      });
      
      const quizElement = document.getElementById('eligibility');
      if (quizElement) {
        observer.observe(quizElement);
      }
      
      return () => observer.disconnect();
    }
  }, [currentQuestion, answers]);

  const selectAnswer = (key: keyof QuizAnswers, value: string) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    
    // Track quiz progress
    trackQuizProgress(currentQuestion, 5);

    // Instant progression - no delay
    if (currentQuestion < 5) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz complete - track completion (eligibility determined in mutation result)
      trackQuizComplete(true); // We'll track detailed eligibility in the server response
      quizMutation.mutate(newAnswers);
    }
  };

  const scrollToLeadForm = () => {
    const section = document.getElementById('contact');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const progressPercent = (currentQuestion / 5) * 100;

  if (showResults) {
    return (
      <section id="eligibility" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              {isEligible ? (
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800">Great News!</h3>
                  <p className="text-green-700">
                    Based on your answers, you may qualify for up to <span className="font-bold">$10,000 in homebuyer assistance</span>.
                  </p>
                  <p className="text-gray-600">
                    Join our waitlist to be notified when spots become available in our program.
                  </p>
                  <Button 
                    onClick={scrollToLeadForm}
                    className="bg-arizona-red text-white hover:bg-red-700 px-8 py-4 h-auto text-lg"
                  >
                    Join Our Waitlist
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <ArrowRight className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-800">Let's Explore Your Options</h3>
                  <p className="text-blue-700">
                    Join our waitlist and we'll notify you if additional program options become available that match your profile.
                  </p>
                  <Button 
                    onClick={scrollToLeadForm}
                    className="bg-arizona-red text-white hover:bg-red-700 px-8 py-4 h-auto text-lg"
                  >
                    Join Our Waitlist
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const currentQ = questions[currentQuestion - 1];

  return (
    <section id="eligibility" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Check Your Eligibility in 60 Seconds
          </h2>
          <p className="text-xl text-gray-600">
            Answer a few quick questions to see if you qualify for 2% in homebuyer credits
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestion} of 5</span>
                <span>{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>

            {/* Current Question */}
            <div className="transition-opacity duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {currentQ.question}
              </h3>
              <div className="space-y-3">
                {currentQ.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => selectAnswer(currentQ.key, option.value)}
                    className={`w-full text-left p-4 border-2 rounded-xl transition-colors ${
                      answers[currentQ.key] === option.value
                        ? 'border-arizona-red bg-red-50'
                        : 'border-gray-200 hover:border-arizona-red hover:bg-red-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 border-2 rounded-full ${
                        answers[currentQ.key] === option.value
                          ? 'bg-arizona-red border-arizona-red'
                          : 'border-gray-300'
                      }`}></div>
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
