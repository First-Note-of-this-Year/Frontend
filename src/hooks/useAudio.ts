import { useCallback, useEffect, useRef, useState } from "react";

export interface UseAudioReturn {
  isPlaying: boolean;
  playAudio: (songUrl: string) => Promise<void>;
  stopAudio: () => void;
  toggleAudio: () => void;
}

export function useAudio(): UseAudioReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = useCallback(async (songUrl: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
      setIsPlaying(false);
    }

    try {
      const newAudio = new Audio(songUrl);
      newAudio.loop = true;
      newAudio.volume = 0.5;

      await new Promise<void>((resolve, reject) => {
        newAudio.oncanplaythrough = () => resolve();
        newAudio.onerror = () => reject(new Error("Audio failed to load"));
        newAudio.onabort = () => reject(new Error("Audio loading aborted"));
      });

      audioRef.current = newAudio;
      await newAudio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Failed to play audio:", error);
      setIsPlaying(false);
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = "";
      audioRef.current = null;
      setIsPlaying(false);
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Failed to play audio:", error);
      });
      setIsPlaying(true);
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current.load();
      }
    };
  }, []);

  return {
    isPlaying,
    playAudio,
    stopAudio,
    toggleAudio,
  };
}
