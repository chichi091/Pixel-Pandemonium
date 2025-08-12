
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { generateAICompliment } from '@/ai/flows/generate-compliment';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export function ComplimentMachine() {
  const [compliment, setCompliment] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCompliment('');
    try {
      const result = await generateAICompliment({});
      if (result.compliment) {
        setCompliment(result.compliment);
      } else {
        throw new Error('AI returned an empty compliment. How rude!');
      }
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Chaos Alert!',
        description:
          'The compliment generator has malfunctioned. The AI might be on a coffee break.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-6">
      <Card className="w-full min-h-[120px] flex items-center justify-center p-6 text-center bg-background border-accent shadow-inner">
        <CardContent className="p-0">
          {isGenerating ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : compliment ? (
            <blockquote className="text-lg font-medium text-foreground italic">
              “{compliment}”
            </blockquote>
          ) : (
            <p className="text-muted-foreground">
              Click the button to receive a surreal, AI-generated compliment!
            </p>
          )}
        </CardContent>
      </Card>
      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        size="lg"
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Summoning Flattery...
          </>
        ) : (
          'Generate Compliment'
        )}
      </Button>
    </div>
  );
}
