
# Pronunciation Practice Application

This is a web-based application designed to help users practice their pronunciation by speaking sentences aloud and receiving feedback. The app provides real-time speech-to-text transcription and suggests phonetic improvements for better accuracy. It also includes features like Text-to-Speech (TTS) playback, the ability to retry pronunciation, and tracks the user's progress across multiple sentences.

## Table of Contents

1. [How to Interact with the App](#how-to-interact-with-the-app)
2. [How the Program Works](#how-the-program-works)
3. [Technologies Used](#technologies-used)
4. [Setup and Installation](#setup-and-installation)


## How to Interact with the App

### Recording & Transcription

1. Open the app and click on "Start Recording" to begin.
2. After recording, click "Transcribe Audio" to get feedback.
3. You will receive a transcription and phonetic suggestions to improve pronunciation.

### Try Again Feature

- After receiving feedback, the button will change to "Try Again?". Click it to attempt the sentence once more.

### Text-to-Speech

- To hear the sentence spoken aloud, click the "Play Sentence" button.

### Navigation

- Once you're done with the current sentence, click the "Next" button to move on to the next phrase.


## How the Program Works

The application prompts users to say a pre-defined sentence aloud. Once the user records their audio, the app transcribes the speech using a speech-to-text API (Google Text to Speech) and compares the transcription against the expected sentence. It provides phonetic feedback and corrections if needed, allowing users to improve their pronunciation.

Key features include:
- **Recording Audio**: Users can record themselves pronouncing the given sentence.
- **Transcription**: The recorded audio is converted to text via an API.
- **Feedback**: Users receive feedback on their pronunciation with specific suggestions for words they may need to improve on.
- **Text-to-Speech**: Users can click to hear the sentence spoken aloud.
- **Try Again**: After transcription, users can retry the same sentence to improve their pronunciation.

## Technologies Used

### Frontend
- **Next.js (v14)**: I chose this framework to allow me to do both the frontend and backend on the same framework and also host it easily on vercel.
- **HTML5 Audio API**: Used for capturing and managing audio input for recording.

### Backend
- **Axios**: For calling third party apis
- **Speech-to-Text API**: I chose to use the GOOGLE-SPEECH-TO-TEXT as they offered a good free tier. I also tried with the native browser speech-to-text API which worked nicely but I was afraid support for older browsers would not be good.

### Additional Libraries
- **SpeechSynthesis (Web API)**: Used for the Text-to-Speech feature that reads the sentence aloud.
- **Dictionaryapi.dev**: This provides very good Phonic help but thought I should provide some friendlier help as well with my own function.

## Setup and Installation

To set up this project locally, follow the steps below:

### 1. Clone the Repository

First, clone this repository to your local machine:

```bash
git clone https://github.com/your-username/pronunciation-app.git

```

### 2. Install Dependencies

Navigate to the project folder and install the required dependencies using npm or yarn:

```bash
bash
Copy code
cd pronunciation-app
npm install
# or
yarn install

```

### 3. Set Up API Keys

This app uses a Speech-to-Text API for audio transcription. You will need to sign up for an API provider (e.g., Google Cloud Speech-to-Text, AssemblyAI, etc.) and get your API key.

Create a `.env.local` file in the root directory and add your API key:

```bash
bash
Copy code
NEXT_PUBLIC_SPEECH_API_KEY=your-api-key-here

```

### 4. Run the Application

Start the development server:

```bash
bash
Copy code
npm run dev
# or
yarn dev

```

The app will be available at `http://localhost:3000`.

### 5. Build for Production

To create an optimized production build:

```bash
bash
Copy code
npm run build
# or
yarn build

```

You can then start the production server with:

```bash
bash
Copy code
npm run start
# or
yarn start

```

### 6. Deploy

If you'd like to deploy the app, Next.js works seamlessly with services like [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/). Simply connect your repository and follow the platform-specific deployment instructions.
