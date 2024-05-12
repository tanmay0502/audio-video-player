import React, { useRef, useState, useEffect } from 'react';
import { useMediaControls } from '@/hooks/useMediaControls';
import Image from 'next/image';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, 
        FiVolume, FiRotateCw,
        FiSkipForward, FiSkipBack, FiX, FiMaximize2 } 
        from 'react-icons/fi';
import { AiOutlineArrowRight, AiOutlineArrowLeft, 
         AiOutlineArrowUp, AiOutlineArrowDown
} from "react-icons/ai";
import { MdFullscreen } from "react-icons/md";
import { useQueue } from '@/hooks/useQueue';

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
  const [isMinimized, setIsMinimized] = useState(false);
  const { queue, nextInQueue, prevInQueue } = useQueue(); 
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
  }, [queue]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'f':
          toggleFullScreen();
          break;
        case 'Escape':
          exitFullScreen();
          break;
        case 'w':
          toggleMinimize();
          break;
        case 'n':
          nextInQueue();
          break;
        case 'p':
          prevInQueue();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextInQueue, prevInQueue]);

  const toggleFullScreen = () => {
    const player = document.querySelector('.video-player, .audio-player');
    if (!document.fullscreenElement) {
      if (player?.requestFullscreen) {
        player.requestFullscreen();
      }
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };
  
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
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
    const mediaUrl = queue.length > 0 ? queue[0].url : fileUrl;
    const mediaType = queue.length > 0 ? queue[0].type : fileType;
    const mediaThumbnail = queue.length > 0 ? queue[0].thumbnail : thumbnail;

    if (isMinimized) {
      return (
        <FloatingBox onClose={toggleMinimize} onExpand={toggleMinimize}>
          {mediaType === 'video/mp4' || mediaType === 'video/webm' ? (
            <video autoPlay={isPlaying} controls={false} ref={mediaRef as React.RefObject<HTMLVideoElement>} src={mediaUrl} width="320" height="240" />
          ) : (
            <div className="audio-player">
              <Image src={mediaThumbnail || "/thumbnails/audioThumbnail.png"} alt="Thumbnail" className="audio-thumbnail" width={100} height={100} />
              <audio autoPlay={isPlaying} controls={false} ref={mediaRef as React.RefObject<HTMLAudioElement>} src={mediaUrl} />
            </div>
          )}
          {controlsVisible && renderControls()}
        </FloatingBox>
      );
    } else {
      if (mediaType === 'video/mp4' || mediaType === 'video/webm') {
        return (
          <div
            className="video-player"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            <video autoPlay={isPlaying} controls={false} ref={mediaRef as React.RefObject<HTMLVideoElement>} src={mediaUrl} width="320" height="240" />
            {controlsVisible && renderControls()}
          </div>
        );
      } else if (mediaType === 'audio/mpeg' || mediaType === 'audio/wav') {
        return (
          <div
            className="audio-player"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            <Image src={mediaThumbnail || "/thumbnails/audioThumbnail.png"} alt="Thumbnail" className="audio-thumbnail" width={100} height={100} />
            <audio autoPlay={isPlaying} controls={false} ref={mediaRef as React.RefObject<HTMLAudioElement>} src={mediaUrl} />
            {controlsVisible && renderControls()}
          </div>
        );
      }
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
        <div className="time-display flex-1 text-sm text-white">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <input type="range" min={0} max={duration} value={currentTime} onChange={(e) => handleSeek(Number(e.target.value))} className=" text-pocket-red bg-white w-full mx-2"  />
      </div>

      <div className="flex items-center justify-center space-x-2 mt-4">

        <button onClick={handleMute} className="bg-blue-500 text-black px-4 py-2 rounded-md flex items-center">
          {isMuted ? <FiVolumeX /> : <FiVolume />}
        </button>

        <button onClick={() => handleVolumeChange(volume - 0.1)} className="bg-blue-500 text-black rounded-md flex items-center">
          -
        </button>

        <input type="range" value={Math.round(volume * 100)} onChange={(e) => handleVolumeChange(Number(e.target.value) / 100)} className="bg-pocket-red text-black px-4 py-2 rounded-md w-20" />
                    
        <button onClick={() => handleVolumeChange(volume + 0.1)} className="bg-blue-500 text-black px-4 py-2 rounded-md flex items-center">
          +
        </button>
        
        <button onClick={prevInQueue} className="bg-blue-500 text-black px-4 py-2 rounded-md">
          <AiOutlineArrowLeft />  
        </button>
        <button onClick={() => handleSeek(currentTime - 10)} className="bg-blue-500 text-black px-4 py-2 rounded-md">
          <FiSkipBack />
        </button>

        <button onClick={handlePlayPause} className="bg-blue-500 text-black px-4 py-2 rounded-md flex items-center">
          {isPlaying ? <FiPause /> : <FiPlay />}
        </button>

        <button onClick={() => handleSeek(currentTime + 10)} className="bg-blue-500 text-black px-4 py-2 rounded-md">
          <FiSkipForward />
        </button>
        <button onClick={nextInQueue} className="bg-blue-500 text-black px-4 py-2 rounded-md">
          <AiOutlineArrowRight />
        </button>

        
        <select value={playbackRate} onChange={(e) => handlePlaybackRateChange(Number(e.target.value))} className="bg-white text-black p-1 rounded-md">
          <option value="0.5">0.5x</option>
          <option value="0.75">0.75x</option>
          <option defaultChecked value="1">1x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>
        <button onClick={() => handleSeek(0)} className="bg-blue-500 text-black px-4 py-2 rounded-md">
          <FiRotateCw />
        </button>

        <button onClick={toggleMinimize} className="bg-blue-500 text-black px-4 py-2 rounded-md">
          {isMinimized ? <AiOutlineArrowUp />: <AiOutlineArrowDown />}
        </button>
        <button onClick={toggleFullScreen} className="bg-blue-500 text-black px-4 py-2 rounded-md">
          <MdFullscreen/>
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
const FloatingBox: React.FC<{ onClose: () => void; onExpand: () => void; children: React.ReactNode }> = ({ onClose, onExpand, children }) => (
  <div className="floating-box">
    <div className="media-wrapper">
      {children}
    </div>
    <div className="controls">
      <button onClick={onClose}><FiX /></button>
      <button onClick={onExpand}><FiMaximize2 /></button>
    </div>
  </div>
);

