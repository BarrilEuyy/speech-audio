
import React, { useState, useCallback } from 'react';
import { generateSpeech } from './services/geminiService';
import { VOICES } from './constants';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { Button } from './components/Button';
import { SelectInput } from './components/SelectInput';
import { TextAreaInput } from './components/TextAreaInput';
import { AudioPlayer } from './components/AudioPlayer';
import { GithubIcon } from './components/icons/GithubIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { TextInput } from './components/TextInput';

export default function App() {
  const [apiKey, setApiKey] = useState<string>('');
  const [text, setText] = useState<string>('Hello! [pause:0.5s] I am a friendly AI assistant powered by Gemini. You can type any text here and I will read it aloud for you.');
  const [selectedVoice, setSelectedVoice] = useState<string>(VOICES[0].value);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { play, pause, isPlaying, audioData, loadAndPlay } = useAudioPlayer();

  const handleGenerateSpeech = useCallback(async () => {
    if (!apiKey.trim() || !text.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const audioContent = await generateSpeech(apiKey, text, selectedVoice);
      if (audioContent) {
        loadAndPlay(audioContent);
      } else {
        setError('Failed to generate speech. The API returned no audio data.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, text, selectedVoice, isLoading, loadAndPlay]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
             <SparklesIcon className="w-10 h-10 text-sky-400"/>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-100">
              Gemini Text-to-Speech
            </h1>
          </div>
          <p className="text-lg text-slate-400">
            Convert text into natural-sounding speech with Google's Gemini API.
          </p>
        </header>

        <main className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl shadow-slate-950/50 p-6 md:p-8 space-y-6">
          <TextInput
            label="Gemini API Key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
            disabled={isLoading}
            required
          />
          <div className="space-y-6">
              <TextAreaInput
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to convert to speech..."
                disabled={isLoading}
              />
               <p className="text-xs text-slate-400 -mt-4 px-1">
                Tip: Use <code className="bg-slate-700 text-slate-200 px-1 py-0.5 rounded-md font-mono">[pause:Xs]</code> to add a pause of X seconds (e.g., <code className="bg-slate-700 text-slate-200 px-1 py-0.5 rounded-md font-mono">[pause:1.5s]</code>).
              </p>
          </div>
          
          <SelectInput
            label="Select a Voice"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            options={VOICES}
            disabled={isLoading}
          />
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm">
              <p><span className="font-semibold">Error:</span> {error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button
              onClick={handleGenerateSpeech}
              isLoading={isLoading}
              disabled={!apiKey.trim() || !text.trim() || isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? 'Generating...' : 'Generate Speech'}
            </Button>
            {audioData && (
              <AudioPlayer 
                isPlaying={isPlaying} 
                onPlayPause={isPlaying ? pause : play} 
                audioData={audioData}
              />
            )}
          </div>
        </main>
      </div>

       <footer className="w-full max-w-2xl mx-auto text-center mt-8 text-slate-500">
        <a 
          href="https://github.com/google-gemini-v2/gemini-api-use-case-examples" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 hover:text-sky-400 transition-colors"
        >
          <GithubIcon className="w-5 h-5" />
          <span>View on GitHub</span>
        </a>
      </footer>
    </div>
  );
}
