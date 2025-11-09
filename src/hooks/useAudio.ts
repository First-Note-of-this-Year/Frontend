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
    // 기존 오디오가 있으면 정리
    if (audioRef.current) {
      const oldAudio = audioRef.current;
      oldAudio.pause();
      oldAudio.currentTime = 0;
      oldAudio.src = "";
      oldAudio.load();
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

      // 새 오디오를 재생하기 전에 다시 한번 확인
      if (audioRef.current) {
        const prevAudio = audioRef.current;
        prevAudio.pause();
        prevAudio.currentTime = 0;
        prevAudio.src = "";
        prevAudio.load();
      }

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
      const audio = audioRef.current;
      audio.pause();
      audio.currentTime = 0;
      audio.src = "";
      audio.load();
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
