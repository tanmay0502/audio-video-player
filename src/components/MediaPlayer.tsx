import React, { useRef, useState, useEffect } from 'react';
import { useMediaControls } from '@/hooks/useMediaControls';
import Image from 'next/image';
import { useQueue } from '@/hooks/useQueue';
import { FiX, FiMaximize2 } from 'react-icons/fi';
import ControlButtons from './ControlButtons';
import FloatingBox from './FloatingBox';

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
  const { queue, prevMediaStack, nextInQueue, prevInQueue } = useQueue();

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
    if (!isFullScreen) {
      const player = document.querySelector('.video-player, .audio-player');
      if (player && player.requestFullscreen) {
        player.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [isFullScreen]);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleBoxClose = () => {
    window.location.reload();
  };

  const renderMedia = () => {
    const mediaUrl = queue.length > 0 ? queue[0].url : fileUrl;
    const mediaType = queue.length > 0 ? queue[0].type : fileType;
    const mediaThumbnail = queue.length > 0 ? queue[0].thumbnail : thumbnail;

    if (isMinimized){
      return (
        <FloatingBox onClose={handleBoxClose} onExpand={toggleMinimize}>
          {mediaType === 'video/mp4' || mediaType === 'video/webm' ? (
            <video autoPlay={isPlaying} controls={false} ref={mediaRef as React.RefObject<HTMLVideoElement>} src={mediaUrl} width="320" height="240" />
          ) : (
            <div className="audio-player">
              <Image src={mediaThumbnail || "/thumbnails/audioThumbnail.jpeg"} alt="Thumbnail" className="audio-thumbnail" width={100} height={100} />
              <audio autoPlay={isPlaying} controls={false} ref={mediaRef as React.RefObject<HTMLAudioElement>} src={mediaUrl} />
            </div>
          )}

        </FloatingBox>
      );
    } else {
      if (mediaType === 'video/mp4' || mediaType === 'video/webm') {
        return (
          <div
            className="video-player"
            onMouseMove={() => setControlsVisible(true)}
            onMouseLeave={() => setControlsVisible(false)}
          >
            <video autoPlay={isPlaying} controls={false} ref={mediaRef as React.RefObject<HTMLVideoElement>} src={mediaUrl} width="320" height="240" />
            {controlsVisible && <ControlButtons
              isPlaying={isPlaying}
              isMuted={isMuted}
              volume={volume}
              playbackRate={playbackRate}
              currentTime={currentTime}
              duration={duration}
              handlePlayPause={handlePlayPause}
              handleVolumeChange={handleVolumeChange}
              handleMute={handleMute}
              handlePlaybackRateChange={handlePlaybackRateChange}
              handleSeek={handleSeek}
              prevInQueue={prevInQueue}
              nextInQueue={nextInQueue}
              prevMediaStack={prevMediaStack}
              queue={queue}
              isMinimized={isMinimized}
              toggleMinimize={toggleMinimize}
              toggleFullScreen={toggleFullScreen}
            />}
          </div>
        );
      } else if (mediaType === 'audio/mpeg' || mediaType === 'audio/wav') {
        return (
          <div
            className="audio-player"
            onMouseMove={() => setControlsVisible(true)}
            onMouseLeave={() => setControlsVisible(false)}
          >
            <Image src={mediaThumbnail || "/thumbnails/audioThumbnail.jpeg"} alt="Thumbnail" className="audio-thumbnail" width={100} height={100} />
            <audio autoPlay={isPlaying} controls={false} ref={mediaRef as React.RefObject<HTMLAudioElement>} src={mediaUrl} />
            {controlsVisible && <ControlButtons
              isPlaying={isPlaying}
              isMuted={isMuted}
              volume={volume}
              playbackRate={playbackRate}
              currentTime={currentTime}
              duration={duration}
              handlePlayPause={handlePlayPause}
              handleVolumeChange={handleVolumeChange}
              handleMute={handleMute}
              handlePlaybackRateChange={handlePlaybackRateChange}
              handleSeek={handleSeek}
              prevInQueue={prevInQueue}
              nextInQueue={nextInQueue}
              prevMediaStack={prevMediaStack}
              queue={queue}
              isMinimized={isMinimized}
              toggleMinimize={toggleMinimize}
              toggleFullScreen={toggleFullScreen}
            />}
          </div>
        );
      }
    }
  };

  return (
    <div>
      {renderMedia()}
    </div>
  );
}

export default MediaPlayer;
