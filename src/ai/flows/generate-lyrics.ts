'use server';
/**
 * @fileOverview Automatically fetches song lyrics using AI.
 *
 * - generateLyrics - A function that fetches lyrics for a given song.
 * - GenerateLyricsInput - The input type for the generateLyrics function.
 * - GenerateLyricsOutput - The return type for the generateLyrics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLyricsInputSchema = z.object({
  artist: z.string().describe('The artist of the song.'),
  title: z.string().describe('The title of the song.'),
});
export type GenerateLyricsInput = z.infer<typeof GenerateLyricsInputSchema>;

const GenerateLyricsOutputSchema = z.object({
  lyrics: z.string().describe('The lyrics of the song.'),
});
export type GenerateLyricsOutput = z.infer<typeof GenerateLyricsOutputSchema>;

export async function generateLyrics(input: GenerateLyricsInput): Promise<GenerateLyricsOutput> {
  return generateLyricsFlow(input);
}

const lyricsPrompt = ai.definePrompt({
  name: 'lyricsPrompt',
  input: {schema: GenerateLyricsInputSchema},
  output: {schema: GenerateLyricsOutputSchema},
  prompt: `You are an AI assistant that provides song lyrics.

  Given the artist and title of a song, you will find and return the lyrics.

  Artist: {{{artist}}}
  Title: {{{title}}}

  Lyrics:`, 
});

const generateLyricsFlow = ai.defineFlow(
  {
    name: 'generateLyricsFlow',
    inputSchema: GenerateLyricsInputSchema,
    outputSchema: GenerateLyricsOutputSchema,
  },
  async input => {
    const {output} = await lyricsPrompt(input);
    return output!;
  }
);
