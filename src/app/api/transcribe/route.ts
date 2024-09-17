import { NextResponse } from 'next/server';
import speech, { protos } from '@google-cloud/speech';
import { diffWordsWithSpace } from 'diff';
import { getFriendlyPhonetic, getPhoneticTranscription } from './helpers';

// Initialize Google Cloud Speech client
const base64Key = process.env.GOOGLE_APPLICATION_CREDENTIALS || '';
const keyFile = Buffer.from(base64Key, 'base64').toString('utf8');
const client = new speech.SpeechClient({
  credentials: JSON.parse(keyFile)
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { audioData, expectedPhrase } = body;

    if (!audioData) {
      return NextResponse.json({ message: 'No audio data provided.' }, { status: 400 });
    }

    // Define supported sample rate
    const sampleRateHertz = 48000; 

    const request: protos.google.cloud.speech.v1.IRecognizeRequest = {
      audio: { content: audioData },
      config: {
        encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16, // Ensure correct encoding
        sampleRateHertz: sampleRateHertz, // Use supported sample rate
        languageCode: 'en-US',
      },
    };

    const [response] = await client.recognize(request);

    const transcription = response.results
      ?.map((result: protos.google.cloud.speech.v1.ISpeechRecognitionResult) =>
        result.alternatives?.[0].transcript || ''
      )
      .join('\n') || '';

    const prepedExpectedPhrase = expectedPhrase.toLowerCase().replace(/[^\w\s]/g, '');
    const diff = diffWordsWithSpace(prepedExpectedPhrase, transcription);

    const feedback = diff.map(part => {
      if (part.added) {
        return `<span style="color: red; text-decoration: line-through;">${part.value}</span>`;
      } else if (part.removed) {
        return `<span style="color: orange; text-decoration: underline;">${part.value}</span>`;
      } else {
        return `<span style="color: green;">${part.value}</span>`;
      }
    }).join(' ');

    const incorrectWords = diff.filter(part => part.removed).map(part => part.value.trim());
    const phoneticSuggestions: { word: string, suggestion: string, phonic: string }[] = [];

    for (const word of incorrectWords) {
      const suggestion = await getFriendlyPhonetic(word);
      const phonic = await getPhoneticTranscription(word);
      phoneticSuggestions.push({ word, suggestion, phonic });
    }

    return NextResponse.json({
      transcription,
      feedback,
      phoneticSuggestions,
    }, { status: 200 });

  } catch (error) {
    console.error('Error during transcription:', error);
    return NextResponse.json({ message: `Error during transcription: ${(error as Error).message}` }, { status: 500 });
  }
}
