
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { generatePotatoWisdom } from '@/ai/flows/generate-potato-wisdom';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PotatoIcon } from './icons/potato-icon';


const potatoBg = `url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 8H4V11H5V14H6V16H7V18H8V19H10V20H14V19H16V18H17V16H18V14H19V11H18V9H17V7H16V6H14V5H10V6H8V7H6V8H5Z' fill='%23D2B48C'/%3E%3Cpath d='M9 10h1v1H9zM15 9h1v1h-1zM12 14h1v1h-1z' fill='%23000' fill-opacity='0.2'/%3E%3C/svg%3E")`;

export function PotatoDimension({ onEasterEggFound }: { onEasterEggFound: (egg: string) => void }) {
  const [wisdom, setWisdom] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setWisdom('');
    try {
      const result = await generatePotatoWisdom({});
      if (result.wisdom) {
        setWisdom(result.wisdom);
      } else {
        throw new Error('The potato sages are silent today.');
      }
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Cosmic Interference!',
        description:
          'The potato dimension is currently unavailable. The astral plane might be experiencing technical difficulties.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div 
        className="flex-grow w-full h-full relative overflow-hidden bg-background/50 rounded-b-lg p-4 flex flex-col items-center justify-center space-y-6"
        style={{
            backgroundImage: potatoBg,
            backgroundSize: '48px 48px',
        }}
    >
         <a href="https://www.youtube.com/watch?v=fQkNDCkioto&list=RDfQkNDCkioto&start_radio=1" onClick={() => onEasterEggFound('potato_link_1')} target="_blank" rel="noopener noreferrer" className="absolute w-12 h-12 z-20" style={{top: '96px', left: '144px'}} aria-label="Secret Potato">
            <PotatoIcon className="w-12 h-12" />
         </a>
         <a href="https://www.alimentarium.org/sites/default/files/media/image/2017-02/AL027-01_pomme_de_terre_0_0.jpg" onClick={() => onEasterEggFound('potato_link_2')} target="_blank" rel="noopener noreferrer" className="absolute w-12 h-12 z-20" style={{top: '217px', left: '768px'}} aria-label="Secret Potato Image">
            <PotatoIcon className="w-12 h-12" />
         </a>
         <Card className="w-full max-w-md min-h-[120px] flex items-center justify-center p-6 text-center bg-secondary shadow-inner border-primary/20 z-10">
            <CardContent className="p-0">
            {isGenerating ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : wisdom ? (
                <blockquote className="text-xl font-medium text-foreground italic">
                 {wisdom}
                </blockquote>
            ) : (
                <div className="flex flex-col items-center text-muted-foreground">
                    <PotatoIcon className="w-12 h-12" />
                    <p className="mt-2">Click the button to receive profound wisdom from the potato sages.</p>
                </div>
            )}
            </CardContent>
        </Card>
        <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            size="lg"
            className="z-10"
        >
            {isGenerating ? (
            <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Consulting the Oracle...
            </>
            ) : (
            'Receive Potato Wisdom'
            )}
        </Button>
    </div>
  );
}
