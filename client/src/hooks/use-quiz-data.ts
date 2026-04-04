import { useState, useEffect } from 'react';

interface QuizData {
  firstTimeBuyer?: string;
  creditScore?: string;
  income?: string;
  priceRange?: string;
  downPaymentNeed?: string;
}

const QUIZ_STORAGE_KEY = 'arizona-home-first-quiz-data';

export function useQuizData() {
  const [quizData, setQuizData] = useState<QuizData | null>(null);

  // Load quiz data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (stored) {
      try {
        setQuizData(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse stored quiz data:', error);
        localStorage.removeItem(QUIZ_STORAGE_KEY);
      }
    }
  }, []);

  const saveQuizData = (data: QuizData) => {
    setQuizData(data);
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(data));
  };

  const clearQuizData = () => {
    setQuizData(null);
    localStorage.removeItem(QUIZ_STORAGE_KEY);
  };

  return {
    quizData,
    saveQuizData,
    clearQuizData,
    hasQuizData: !!quizData
  };
}