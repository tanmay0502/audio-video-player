import React, { useRef, useState, useEffect } from 'react';
import { useMediaControls } from '@/hooks/useMediaControls';
import Image from 'next/image';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, 
        FiVolume, FiRotateCw,
        FiSkipForward, FiSkipBack } 
        from 'react-icons/fi';

type MediaPlayerProps = {
  fileUrl: string | undefined;
  fileType: string | undefined;
  thumbnail: string | undefined;
};

export function MediaPlayer({ fileUrl, fileType, thumbnail }: MediaPlayerProps) {
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  let controlsTimeout: ReturnType<typeof setTimeout>;
  let mouseMoveTimeout: ReturnType<typeof setTimeout>;

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

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const toggleFullScreen = () => {
    const player = document.querySelector('.video-player, .audio-player');
    if (!document.fullscreenElement) {
      if (player?.requestFullscreen) {
        player.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  

  const toggleMinimize = () => {
    const playerElement = document.querySelector('.video-player, .audio-player');
    if (playerElement) {
      playerElement.classList.toggle('minimized');
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleMouseEnter = () => {
    setControlsVisible(true);
    clearTimeout(controlsTimeout);
  };

  const handleMouseLeave = () => {
    controlsTimeout = setTimeout(() => {
      setControlsVisible(false);
    }, 5000); 
  };

  const handleMouseMove = () => {
    setControlsVisible(true);
    clearTimeout(controlsTimeout);
    clearTimeout(mouseMoveTimeout);
    mouseMoveTimeout = setTimeout(() => {
      setControlsVisible(false);
    }, 5000); 
  };

  const renderMedia = () => {
    if (fileType === 'video/mp4' || fileType === 'video/webm') {
      return (
        <div
          className="video-player"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <video autoPlay={isPlaying} controls={false} ref={mediaRef as React.RefObject<HTMLVideoElement>} src={fileUrl} width="320" height="240" />
          {controlsVisible && renderControls()}
        </div>
      );
    } else if (fileType === 'audio/mpeg' || fileType === 'audio/wav') {
      return (
        <div
          className="audio-player"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <Image src={thumbnail || "/thumbnails/audioThumbnail.png"} alt="Thumbnail" className="audio-thumbnail" width={100} height={100} />
          <audio autoPlay={isPlaying} controls={false} ref={mediaRef as React.RefObject<HTMLAudioElement>} src={fileUrl} />
          {controlsVisible && renderControls()}
        </div>
      );
    }
  };
  
  const renderControls = () => (
    <div 
      className="media-controls flex flex-col items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div className="flex items-center w-full">
        <div className="time-display flex-1 text-sm text-gray-500">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <input type="range" min={0} max={duration} value={currentTime} onChange={(e) => handleSeek(Number(e.target.value))} className="w-full mx-2" />
      </div>
      <div className="flex items-center justify-center space-x-2 mt-4">
        <button onClick={handlePlayPause} className="bg-blue-500 text-black px-4 py-2 rounded-md flex items-center">
          {isPlaying ? <FiPause className="mr-2" /> : <FiPlay className="mr-2" />}
        </button>
        <button onClick={handleMute} className="bg-blue-500 text-black px-4 py-2 rounded-md flex items-center">
          {isMuted ? <FiVolumeX className="mr-2" /> : <FiVolume className="mr-2" />}
        </button>
        
        <button onClick={() => handleVolumeChange(volume + 0.1)} className="bg-blue-500 text-black px-4 py-2 rounded-md flex items-center">
          +
        </button>
        <input type="range" value={Math.round(volume * 100)} onChange={(e) => handleVolumeChange(Number(e.target.value) / 100)} className="bg-blue-500 text-black px-4 py-2 rounded-md w-20" />
        <button onClick={() => handleVolumeChange(volume - 0.1)} className="bg-blue-500 text-black px-4 py-2 rounded-md flex items-center">
          -
        </button>
        <select value={playbackRate} onChange={(e) => handlePlaybackRateChange(Number(e.target.value))} className="bg-blue-500 text-black px-4 py-2 rounded-md">
          <option value="1">1x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
        </select>
        <button onClick={() => handleSeek(0)} className="bg-blue-500 text-black px-4 py-2 rounded-md">
          <FiRotateCw className="mr-2" />
          Restart
        </button>
        <button onClick={() => handleSeek(currentTime + 10)} className="bg-blue-500 text-black px-4 py-2 rounded-md">
          <FiSkipForward className="mr-2" />
          10s Forward
        </button>
        <button onClick={() => handleSeek(currentTime - 10)} className="bg-blue-500 text-black px-4 py-2 rounded-md">
          <FiSkipBack className="mr-2" />
          10s Backward
        </button>
        <button onClick={toggleFullScreen} className="bg-blue-500 text-black px-4 py-2 rounded-md">
          Fullscreen
        </button>
      </div>
    </div>
  );
  
  return (
    <div>
      {renderMedia()}
    </div>
  );
}
