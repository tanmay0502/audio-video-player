import React, { useRef, useState, useEffect } from 'react';
import { useMediaControls } from '@/hooks/useMediaControls';
import Image from 'next/image';

type MediaPlayerProps = {
  fileUrl: string | undefined;
  fileType: string | undefined;
  thumbnail: string | undefined;
};

export function MediaPlayer({ fileUrl, fileType, thumbnail }: MediaPlayerProps) {
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);

  const {
    isPlaying,
    volume,
    isMuted,
    playbackRate,
    currentTime,
    handlePlayPause,
    handleVolumeChange,
    handleMute,
    handlePlaybackRateChange,
    handleSeek,
  } = useMediaControls(mediaRef);

  useEffect(() => {
    const media = mediaRef.current;
    if (media) {
      media.onloadedmetadata = () => {
        setDuration(media.duration);
      };
    }
  }, [fileUrl, fileType]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const renderMedia = () => {
    if (fileType === 'video/mp4' || fileType === 'video/webm') {
      return (
        <div className="video-player">
          <video autoPlay ref={mediaRef as React.RefObject<HTMLVideoElement>} src={fileUrl} width="320" height="240" />
          {renderControls()}
        </div>
      );
    } else if (fileType === 'audio/mpeg' || fileType === 'audio/wav') {
      return (
        <div className="audio-player"> 
          <Image src={thumbnail || "/thumbnails/audioThumbnail.png"} alt="Thumbnail" className="audio-thumbnail" width={100} height={100} />
          <audio autoPlay ref={mediaRef as React.RefObject<HTMLAudioElement>} src={fileUrl} />
          {renderControls()}
        </div>
      );
    }
  };
  
  const renderControls = () => (
    <div className="media-controls">
      <div className="time-display">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
      <input type="range" min={0} max={duration} value={currentTime} onChange={(e) => handleSeek(Number(e.target.value))} />
      <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      <button onClick={() => handleVolumeChange(volume + 0.1)}>Volume Up</button>
      <button onClick={() => handleVolumeChange(volume - 0.1)}>Volume Down</button>
      <button onClick={handleMute}>{isMuted ? 'Unmute' : 'Mute'}</button>
      <button onClick={() => handlePlaybackRateChange(playbackRate + 0.1)}>Speed Up</button>
      <button onClick={() => handlePlaybackRateChange(playbackRate - 0.1)}>Slow Down</button>
      <button onClick={() => handleSeek(0)}>Restart</button>
    </div>
  );

  return (
    <div>
      {renderMedia()}
    </div>
  );
}