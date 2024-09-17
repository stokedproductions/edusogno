"use client"

import { useState } from 'react';

export default function SpeechRecognitionTest() {
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);

  let recognition: SpeechRecognition | null = null;

  if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
  }

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        setIsListening(false);
        recognition.stop();
      };

      recognition.onerror = () => {
        console.error('Speech Recognition Error:');
        setIsListening(false);
      };
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div>
      <h1>Speech Recognition Test</h1>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? 'Stop Listening' : 'Start Speaking'}
      </button>
      <p>Transcript: {transcript}</p>
    </div>
  );
}


///

// "use client";
// import { useState, FormEvent } from "react";

// // Define types for the feedback response and error
// type FeedbackResponse = {
// 	pronunciation: string;
// 	suggestions: string[];
// };

// type ErrorType = {
// 	message: string;
// };

// export default function Home() {
// 	const [text, setText] = useState<string>("");
// 	const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
// 	const [isListening, setIsListening] = useState<boolean>(false);
// 	const [error, setError] = useState<ErrorType | null>(null);

// 	let recognition: SpeechRecognition | null = null;

// 	if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
// 		const SpeechRecognition = window.webkitSpeechRecognition;
// 		recognition = new SpeechRecognition();
// 		recognition.continuous = false;
// 		recognition.interimResults = false;
// 		recognition.lang = "en-US";
// 	}

// 	const startListening = () => {
// 		if (recognition) {
// 			setIsListening(true);
// 			recognition.start();

// 			recognition.onresult = (event: SpeechRecognitionEvent) => {
// 				const transcript = event.results[0][0].transcript;
// 				setText(transcript);
// 				setIsListening(false);
// 				recognition.stop();
// 			};

// 			recognition.onerror = () => {
// 				console.error("Speech Recognition Error:");
// 				setIsListening(false);
// 			};
// 		}
// 	};

// 	const stopListening = () => {
// 		if (recognition) {
// 			recognition.stop();
// 			setIsListening(false);
// 		}
// 	};

// 	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
// 		e.preventDefault();
// 		try {
// 			// Assuming there's a feedback API to send the transcript to for processing
// 			const res = await fetch("/api/feedback", {
// 				method: "POST",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify({ text }),
// 			});

// 			const feedbackData: FeedbackResponse = await res.json();
// 			setFeedback(feedbackData);
// 		} catch (error) {
// 			console.error("Error fetching feedback:", error);
// 			setError({ message: "Error fetching feedback. Please try again." });
// 		}
// 	};

// 	return (
// 		<div className="bg-[#212121] p-20 w-full md:w-2/3 lg:w-1/3 mx-auto flex justify-center items-center flex-col ">
// 			<h1 className="text-3xl text-center font-bold pb-10">
// 				Practice your pronunciation and grammer
// 			</h1>
// 			<form onSubmit={handleSubmit}>
// 				<div className="flex flex-row justify-center items-center gap-10">
// 					<textarea
// 						value={text}
// 						onChange={(e) => setText(e.target.value)}
// 						placeholder="Speak or enter text here"
// 						rows={4}
// 						cols={50}
// 						className="text-black p-5 rounded-lg"
// 					/>
// 					<button
// 						onClick={isListening ? stopListening : startListening}
// 						className={`text-white font-bold py-2 px-4 rounded-full text-4xl w-[4rem] h-[4rem] 
//              flex items-center justify-center ${isListening ? "bg-red-500" : "bg-blue-500"}`}
// 					>
// 						🎙️
// 					</button>
// 				</div>
// 				<div className="flex flex-row justify-center items-center gap-10 my-10">
//         <button
// 					type="submit"
// 					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
// 				>
// 					Get Feedback
// 				</button>
//         </div>
// 			</form>

// 			{feedback && (
// 				<div>
// 					<h2>Feedback:</h2>
// 					<p>Pronunciation: {feedback.pronunciation}</p>
// 					<p>Suggestions:</p>
// 					<p>{JSON.stringify(feedback)}</p>
// 					{/* <ul>
//             {feedback.suggestions.map((suggestion, index) => (
//               <li key={index}>{suggestion}</li>
//             ))}
//           </ul> */}
// 				</div>
// 			)}

// 			{error && <p style={{ color: "red" }}>{error.message}</p>}
// 		</div>
// 	);
// }
