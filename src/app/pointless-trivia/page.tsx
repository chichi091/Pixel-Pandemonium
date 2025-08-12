
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateTriviaQuestion, type GenerateTriviaOutput } from '@/ai/flows/generate-trivia-question';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PointlessTriviaPage() {
  const [question, setQuestion] = useState<GenerateTriviaOutput | null>(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { toast } = useToast();

  const fetchQuestion = useCallback(async () => {
    setIsLoading(true);
    setIsAnswered(false);
    setSelectedAnswer(null);
    try {
      const newQuestion = await generateTriviaQuestion({});
      setQuestion(newQuestion);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Failed to fetch trivia',
        description: 'The AI might be pondering the meaning of pointlessness. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const handleAnswerClick = (answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === question?.correctAnswer) {
      setScore(prev => prev + 1);
      toast({
        title: 'Correct!',
        description: 'Your knowledge of the pointless is impressive.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Incorrect!',
        description: 'A truly pointless guess.',
      });
    }
  };
  
  const handleNextQuestion = () => {
    fetchQuestion();
  };
  
  const resetGame = () => {
    setScore(0);
    fetchQuestion();
  };

  const getButtonClass = (answer: string) => {
    if (!isAnswered) {
      return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
    }
    if (answer === question?.correctAnswer) {
      return 'bg-green-500 hover:bg-green-500/90 text-white';
    }
    if (answer === selectedAnswer && answer !== question?.correctAnswer) {
      return 'bg-destructive hover:bg-destructive/90 text-destructive-foreground';
    }
    return 'bg-secondary/50 text-muted-foreground';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold font-headline text-primary">Pointless Trivia</h1>
        <p className="text-xl text-muted-foreground mt-2">Test your knowledge of things that don't matter.</p>
      </div>

      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle>Score: {score}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[250px] space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-muted-foreground">The AI is digging up some obscure facts...</p>
            </div>
          ) : question ? (
            <div className="flex flex-col space-y-4">
              <p className="text-center text-xl font-semibold">{question.question}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.answers.map((answer, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerClick(answer)}
                    disabled={isAnswered}
                    className={cn('h-auto py-3 text-base whitespace-normal', getButtonClass(answer))}
                  >
                    {answer}
                  </Button>
                ))}
              </div>
              {isAnswered && (
                 <Alert variant={selectedAnswer === question.correctAnswer ? "default" : "destructive"} className="mt-4 animate-in fade-in">
                  <AlertTitle>{selectedAnswer === question.correctAnswer ? "That's Right!" : "Not Quite!"}</AlertTitle>
                  <AlertDescription>
                    {question.explanation}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No question loaded. Try refreshing.</p>
          )}
        </CardContent>
      </Card>
      
      <div className="flex gap-4 mt-8">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hub
          </Link>
        </Button>
         <Button onClick={isAnswered ? handleNextQuestion : resetGame} disabled={isLoading}>
            {isAnswered ? "Next Question" : "Reset Game"}
         </Button>
      </div>
    </div>
  );
}
