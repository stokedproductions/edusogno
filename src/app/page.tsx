"use client";
import { useState, useRef } from 'react';
import axios from 'axios';

export default function Home() {
  const [transcription, setTranscription] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [phoneticSuggestions, setPhoneticSuggestions] = useState<{ word: string, suggestion: string, phonic: string }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state for API call
  const [isTranscribed, setIsTranscribed] = useState(false); // New state to track if transcription is done
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const expectedPhrases = [
    "Can you please pass the salt?",
    "I need to make a phone call.",
    "What time is the meeting scheduled for?",
    "I’d like to order a cup of coffee.",
    "Where is the nearest grocery store?",
    "I have an appointment at 3 PM.",
    "Could you help me with this task?",
    "I’m looking for a good place to eat lunch.",
    "How much does this item cost?",
    "I need directions to the nearest hospital."
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const currentPhrase = expectedPhrases[currentPhraseIndex];

  const startRecording = async () => {
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        setAudioData(audioBlob);
        setIsRecording(false);
      };
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("Error accessing the microphone:", err);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  };

  const handleTranscribe = async () => {
    if (!audioData) return;

    setIsLoading(true); // Set loading to true before API call
    const reader = new FileReader();
    reader.readAsDataURL(audioData);
    reader.onloadend = async () => {
      const base64Audio = reader.result?.toString().split(',')[1];
      try {
        const res = await axios.post('/api/transcribe', { audioData: base64Audio, expectedPhrase: currentPhrase });
        setTranscription(res.data.transcription);
        setFeedback(res.data.feedback);
        setPhoneticSuggestions(res.data.phoneticSuggestions);
        setIsTranscribed(true); // Mark transcription as completed
      } catch (error) {
        console.error('Error transcribing audio:', error);
      } finally {
        setIsLoading(false); // Set loading to false after the API call finishes
      }
    };
  };

  const handleClearState = () => {
    setTranscription(null); // Clear transcription
    setFeedback(null); // Clear feedback
    setPhoneticSuggestions([]); // Clear phonetic suggestions
    setAudioData(null); // Clear audio data
    setIsTranscribed(false); // Reset transcription status
  }

  const handleNextPhrase = () => {
    // Move to the next phrase and reset state
    setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % expectedPhrases.length);
    handleClearState();
  };

  // Handle combined button action
  const handleRecordOrTranscribe = async () => {
    if (isRecording) {
      stopRecording();
    } else if (audioData && !isTranscribed) {
      await handleTranscribe();
    } 
    else if (isTranscribed) {
      handleClearState();
    }
    else {
      startRecording();
    }
  };

  // Function to play the sentence using Text-to-Speech
  const handlePlaySentence = () => {
    const utterance = new SpeechSynthesisUtterance(currentPhrase);
    utterance.lang = 'en-US'; // Set the language to English (US), adjust as needed
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <div className='bg-[#212121] p-10 w-full max-w-xl'>
        <h1 className='text-4xl font-bold text-white mb-5 text-center'>Practice your Pronunciation</h1>
        <p className="mb-3 text-2xl text-white">Try saying:</p>
        <p className='bg-[#313131] text-center py-5 my-5 text-2xl text-white font-bold'><strong>{currentPhrase}</strong></p>
        <div className='flex justify-center mb-10 gap-10'>
        <button
            onClick={handlePlaySentence}
            className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
          >
            Play Sentence
          </button>
          <button
            onClick={handleRecordOrTranscribe}
            className={`bg-${isRecording ? 'red' : 'blue'}-500 hover:bg-${isRecording ? 'red' : 'blue'}-700 text-white font-bold py-2 px-4 rounded`}
            disabled={isLoading} // Disable button while loading
          >
            {isRecording
              ? 'Stop Recording'
              : audioData && !isTranscribed
              ? 'Get Feedback'
              : isTranscribed
              ? 'Try Again?'
              : 'Start Recording'}
          </button>
        </div>

        {/* Show Loading Spinner */}
        {isLoading && (
          <div className='flex justify-center mb-10'>
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500" role="status"></div>
          </div>
        )}

        {transcription && (
          <div className='p-5'>
            <h2 className='text-white'>Transcription:</h2>
            <p className='text-white'>{transcription}</p>
          </div>
        )}
        {feedback && (
          <div className='p-5 text-white'>
            <h2>Feedback:</h2>
            <p className={feedback} dangerouslySetInnerHTML={{ __html: feedback }}></p>
          </div>
        )}
        {phoneticSuggestions.length > 0 && (
          <div className='p-5 text-white' id='phonetic-suggestions'>
            <h2>Phonetic Suggestions:</h2>
            <ul>
              {phoneticSuggestions.map((suggestion, index) => (
                <li key={index} className="list-item list-disc">
                  Try pronouncing &quot;<strong>{suggestion.word}</strong>&quot; as &quot;<em>{suggestion.suggestion}</em>&quot; {suggestion.phonic ? `|| ${suggestion.phonic}`: ''};
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Button at the Bottom */}
        <div className='flex justify-center mt-10'>
          <button
            onClick={handleNextPhrase}
            className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
            disabled={isLoading} // Disable Next button while loading
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
