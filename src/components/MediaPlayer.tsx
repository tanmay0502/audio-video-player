import React, { useRef } from 'react';
import { useMediaControls } from '@/hooks/useMediaControls';

type MediaPlayerProps = {
  fileUrl: string | undefined;
  fileType: string | undefined;
};

export function MediaPlayer({ fileUrl, fileType }: MediaPlayerProps) {
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const {
    isPlaying,
    volume,
    isMuted,
    playbackRate,
    handlePlayPause,
    handleVolumeChange,
    handleMute,
    handlePlaybackRateChange,
    handleSeek,
  } = useMediaControls(mediaRef);

  const renderMedia = () => {
    if (fileType === 'video/mp4' || fileType === 'video/webm') {
      return <video ref={mediaRef as React.RefObject<HTMLVideoElement>} src={fileUrl} width="320" height="240" />;
    } else if (fileType === 'audio/mpeg' || fileType === 'audio/wav') {
      return <audio ref={mediaRef as React.RefObject<HTMLAudioElement>} src={fileUrl} />;
    }
  };

  return (
    <div>
      {renderMedia()}
      <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      <button onClick={() => handleVolumeChange(volume + 0.1)}>Volume Up</button>
      <button onClick={() => handleVolumeChange(volume - 0.1)}>Volume Down</button>
      <button onClick={handleMute}>{isMuted ? 'Unmute' : 'Mute'}</button>
      <button onClick={() => handlePlaybackRateChange(playbackRate + 0.1)}>Speed Up</button>
      <button onClick={() => handlePlaybackRateChange(playbackRate - 0.1)}>Slow Down</button>
      <button onClick={() => handleSeek(0)}>Rewind</button>
    </div>
  );
}
