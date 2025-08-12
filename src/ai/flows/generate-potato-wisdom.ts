'use server';

/**
 * @fileOverview AI-powered potato wisdom generator.
 *
 * - generatePotatoWisdom - A function that generates a piece of potato-themed wisdom.
 * - GeneratePotatoWisdomInput - The input type for the generatePotatoWisdom function (currently empty).
 * - GeneratePotatoWisdomOutput - The return type for the generatePotatoWisdom function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePotatoWisdomInputSchema = z.object({});
export type GeneratePotatoWisdomInput = z.infer<typeof GeneratePotatoWisdomInputSchema>;

const GeneratePotatoWisdomOutputSchema = z.object({
  wisdom: z.string().describe('A piece of potato-themed wisdom. It can be profound, funny, or absurd.'),
});
export type GeneratePotatoWisdomOutput = z.infer<typeof GeneratePotatoWisdomOutputSchema>;

export async function generatePotatoWisdom(
  input: GeneratePotatoWisdomInput
): Promise<GeneratePotatoWisdomOutput> {
  return generatePotatoWisdomFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePotatoWisdomPrompt',
  input: {schema: GeneratePotatoWisdomInputSchema},
  output: {schema: GeneratePotatoWisdomOutputSchema},
  prompt: `You are a wise, ancient potato sage.

  Generate a single, unique piece of potato-themed wisdom. It can be profound, funny, or absurd. Do not include quotation marks.
  
  Examples:
  - The eye of the potato sees all truths.
  - To be mashed is not a defeat, but a new beginning.
  - A rolling potato gathers no moss, but it might get bruised.
  - True happiness is a perfectly baked potato.
  `,
});

const generatePotatoWisdomFlow = ai.defineFlow(
  {
    name: 'generatePotatoWisdomFlow',
    inputSchema: GeneratePotatoWisdomInputSchema,
    outputSchema: GeneratePotatoWisdomOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
