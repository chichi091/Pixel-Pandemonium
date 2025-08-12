'use server';

/**
 * @fileOverview AI-powered pointless trivia question generator.
 *
 * - generateTriviaQuestion - A function that generates a pointless trivia question.
 * - GenerateTriviaInput - The input type for the generateTriviaQuestion function.
 * - GenerateTriviaOutput - The return type for the generateTriviaQuestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateTriviaInputSchema = z.object({});
export type GenerateTriviaInput = z.infer<typeof GenerateTriviaInputSchema>;

const GenerateTriviaOutputSchema = z.object({
  question: z.string().describe('An obscure, funny, or pointless trivia question.'),
  answers: z.array(z.string()).length(4).describe('An array of exactly four possible answers.'),
  correctAnswer: z.string().describe('The correct answer, which must be one of the strings in the answers array.'),
  explanation: z.string().describe('A short, fun explanation for why the answer is correct.'),
});
export type GenerateTriviaOutput = z.infer<typeof GenerateTriviaOutputSchema>;

export async function generateTriviaQuestion(
  input: GenerateTriviaInput
): Promise<GenerateTriviaOutput> {
  return generateTriviaQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTriviaPrompt',
  input: { schema: GenerateTriviaInputSchema },
  output: { schema: GenerateTriviaOutputSchema },
  prompt: `You are a generator of obscure, pointless, and funny trivia questions.
  
  Create a single multiple-choice trivia question with exactly four possible answers. One of the answers must be correct.
  
  Also provide a short, fun explanation for the correct answer. The topic should be something trivial and amusing.
  
  Ensure the question is safe for all audiences. Avoid overly technical or niche topics that a general audience wouldn't find amusing.

  Include topics from the following categories:
  - Video Games
  - Anime
  - Animals
  - Weird History
  - Obscure Pop Culture

  Example Topic: The history of the spork.
  Example Topic: How many dimples are on a standard golf ball?
  Example Topic: What was the original color of bubble gum?
  Example Topic: In the original 'The Legend of Zelda', what is the maximum number of rupees you can hold?
  Example Topic: What is the scientific name for the fear of long words?
  `,
});

const generateTriviaQuestionFlow = ai.defineFlow(
  {
    name: 'generateTriviaQuestionFlow',
    inputSchema: GenerateTriviaInputSchema,
    outputSchema: GenerateTriviaOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
