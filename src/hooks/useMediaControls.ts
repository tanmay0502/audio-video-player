import { useReducer, useEffect, RefObject } from 'react';

type State = {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  currentTime: number;
  duration: number;
};

type Action =
  | { type: 'PLAY_PAUSE' }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'MUTE' }
  | { type: 'SET_PLAYBACK_RATE'; playbackRate: number }
  | { type: 'SET_CURRENT_TIME'; currentTime: number }
  | { type: 'SET_DURATION'; duration: number };

const initialState: State = {
  isPlaying: false,
  volume: 1,
  isMuted: false,
  playbackRate: 1,
  currentTime: 0,
  duration: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'PLAY_PAUSE':
      return { ...state, isPlaying: !state.isPlaying };
    case 'SET_VOLUME':
      return { ...state, volume: action.volume };
    case 'MUTE':
      return { ...state, isMuted: !state.isMuted };
    case 'SET_PLAYBACK_RATE':
      return { ...state, playbackRate: action.playbackRate };
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.currentTime };
    case 'SET_DURATION':
      return { ...state, duration: action.duration };
    default:
      throw new Error();
  }
}

export const useMediaControls = (mediaRef: RefObject<HTMLVideoElement | HTMLAudioElement>) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const currentMediaRef = mediaRef.current;
  
    const handleTimeUpdate = () => {
      if (currentMediaRef) {
        dispatch({ type: 'SET_CURRENT_TIME', currentTime: currentMediaRef.currentTime });
        dispatch({ type: 'SET_DURATION', duration: currentMediaRef.duration });
      }
    };
  
    const handleVolumeChange = () => {
      if (currentMediaRef) {
        dispatch({ type: 'SET_VOLUME', volume: currentMediaRef.volume });
        dispatch({ type: 'MUTE' });
      }
    };
  
    if (currentMediaRef) {
      currentMediaRef.addEventListener('timeupdate', handleTimeUpdate);
      currentMediaRef.addEventListener('volumechange', handleVolumeChange);
    }
  
    return () => {
      if (currentMediaRef) {
        currentMediaRef.removeEventListener('timeupdate', handleTimeUpdate);
        currentMediaRef.removeEventListener('volumechange', handleVolumeChange);
      }
    };
  }, [mediaRef]);
  

  const handlePlayPause = () => {
    if (mediaRef.current) {
      if (state.isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      dispatch({ type: 'PLAY_PAUSE' });
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (mediaRef.current) {
      newVolume = Math.min(1, Math.max(0, newVolume)); 
      mediaRef.current.volume = newVolume;
      dispatch({ type: 'SET_VOLUME', volume: newVolume });
    }
  };

  const handleMute = () => {
    if (mediaRef.current) {
      mediaRef.current.muted = !mediaRef.current.muted;
      dispatch({ type: 'MUTE' });
    }
  };

  const handlePlaybackRateChange = (newRate: number) => {
    if (mediaRef.current) {
      mediaRef.current.playbackRate = newRate;
      dispatch({ type: 'SET_PLAYBACK_RATE', playbackRate: newRate });
    }
  };

  const handleSeek = (newTime: number) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = newTime;
      dispatch({ type: 'SET_CURRENT_TIME', currentTime: newTime });
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    switch(event.code) {
      case 'Space':
        handlePlayPause();
        break;
      case 'KeyM':
        handleMute();
        break;
      case 'ArrowUp':
        handleVolumeChange(state.volume + 0.1);
        break;
      case 'ArrowDown':
        handleVolumeChange(state.volume - 0.1);
        break;
      case 'BracketRight':
        handlePlaybackRateChange(state.playbackRate + 0.1);
        break;
      case 'BracketLeft':
        handlePlaybackRateChange(state.playbackRate - 0.1);
        break;
      default:
        break;
    }
  };
  

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return {
    ...state,
    handlePlayPause,
    handleVolumeChange,
    handleMute,
    handlePlaybackRateChange,
    handleSeek,
  };
};
