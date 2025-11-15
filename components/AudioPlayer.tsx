import React from 'react';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { SpeakerWaveIcon } from './icons/SpeakerWaveIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { createWavBlobFromBase64 } from '../utils/wavEncoder';

interface AudioPlayerProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  audioData: string | null;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ isPlaying, onPlayPause, audioData }) => {
  const handleDownload = () => {
    if (!audioData) return;

    try {
      const blob = createWavBlobFromBase64(audioData);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gemini-speech.wav';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to create download link:", error);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 w-full sm:w-auto">
      <SpeakerWaveIcon className={`w-6 h-6 ${isPlaying ? 'text-sky-400' : 'text-slate-400'}`} />
      <span className="flex-grow text-sm font-medium text-slate-300">Generated Audio</span>
      <button
        onClick={onPlayPause}
        className="p-2 rounded-full bg-slate-600 hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors"
        aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
      >
        {isPlaying ? (
          <PauseIcon className="w-5 h-5 text-white" />
        ) : (
          <PlayIcon className="w-5 h-5 text-white" />
        )}
      </button>
      {audioData && (
        <button
          onClick={handleDownload}
          className="p-2 rounded-full bg-slate-600 hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors"
          aria-label="Download audio"
        >
          <DownloadIcon className="w-5 h-5 text-white" />
        </button>
      )}
    </div>
  );
};