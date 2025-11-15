import { useState, useRef, useCallback, useEffect } from 'react';
import { decode, decodeAudioData } from '../utils/audioUtils';

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    // Initialize AudioContext only once
    if (!audioContextRef.current) {
        try {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        } catch(e) {
            console.error("Web Audio API is not supported in this browser.", e);
        }
    }
    
    // Cleanup on unmount
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const stopCurrentPlayback = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.onended = null; // Prevent onended from firing on manual stop
      sourceRef.current.stop();
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (!audioContextRef.current || !audioBufferRef.current || isPlaying) return;

    // Resume if suspended
    if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
    }
    
    stopCurrentPlayback(); // Stop any previous playback

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.connect(audioContextRef.current.destination);
    source.onended = () => {
      setIsPlaying(false);
      sourceRef.current = null;
    };
    source.start(0);
    sourceRef.current = source;
    setIsPlaying(true);
  }, [isPlaying, stopCurrentPlayback]);

  const pause = useCallback(() => {
    stopCurrentPlayback();
  }, [stopCurrentPlayback]);

  const loadAndPlay = useCallback(async (base64Audio: string) => {
    if (!audioContextRef.current) return;
    stopCurrentPlayback();

    try {
        setAudioData(base64Audio);
        const pcmData = decode(base64Audio);
        const buffer = await decodeAudioData(pcmData, audioContextRef.current, 24000, 1);
        audioBufferRef.current = buffer;
        play();
    } catch(e) {
        console.error("Failed to decode or play audio", e);
    }
  }, [stopCurrentPlayback, play]);

  return { play, pause, isPlaying, audioData, loadAndPlay };
};