import React, { useState, useEffect } from 'react';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiVolume, FiRotateCw, FiSkipForward, FiSkipBack, FiX, FiMaximize2, FiMenu } from 'react-icons/fi';
import { AiOutlineArrowRight, AiOutlineArrowLeft, AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import { MdNotInterested, MdFullscreen } from "react-icons/md";

type ControlButtonsProps = {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  playbackRate: number;
  currentTime: number;
  duration: number;
  handlePlayPause: () => void;
  handleVolumeChange: (value: number) => void;
  handleMute: () => void;
  handlePlaybackRateChange: (value: number) => void;
  handleSeek: (value: number) => void;
  prevInQueue: () => void;
  nextInQueue: () => void;
  prevMediaStack: any[];
  queue: any[];
  isMinimized: boolean;
  toggleMinimize: () => void;
  toggleFullScreen: () => void;
};

const ControlButtons: React.FC<ControlButtonsProps> = ({
  isPlaying,
  isMuted,
  volume,
  playbackRate,
  currentTime,
  duration,
  handlePlayPause,
  handleVolumeChange,
  handleMute,
  handlePlaybackRateChange,
  handleSeek,
  prevInQueue,
  nextInQueue,
  prevMediaStack,
  queue,
  isMinimized,
  toggleMinimize,
  toggleFullScreen,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="media-controls flex flex-col items-center">
      <div className="flex items-center w-full">
        <div className="time-display flex-1 text-sm text-white">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => handleSeek(Number(e.target.value))}
          className="text-pocket-red bg-white w-full mx-2"
        />
      </div>

      <div className="flex items-center justify-center space-x-2 mt-4">
        {isMobile ? (
          <>
          <button onClick={handlePlayPause} className="bg-blue-500 text-black px-4 py-2 rounded-md flex items-center">
            {isPlaying ? <FiPause /> : <FiPlay />}
          </button>
          
          <button onClick={toggleFullScreen} className="bg-blue-500 text-black px-4 py-2 rounded-md">
          <MdFullscreen />
        </button>
        </>
        ) : (
          <>
            <button onClick={handleMute} className="bg-blue-500 text-black px-4 py-2 rounded-md flex items-center">
              {isMuted ? <FiVolumeX /> : <FiVolume />}
            </button>

            <button onClick={() => handleVolumeChange(volume - 0.1)} className="bg-blue-500 text-black rounded-md flex items-center">
              -
            </button>

            <input
              type="range"
              value={Math.round(volume * 100)}
              onChange={(e) => {
                const newVolume = Number(e.target.value) / 100;
                if (newVolume === 0) {
                  handleMute();
                } else {
                  handleVolumeChange(newVolume);
                }
              }}
              className="bg-pocket-red text-black rounded-md w-20"
            />

            <button onClick={() => handleVolumeChange(volume + 0.1)} className="bg-blue-500 text-black px-4 py-2 rounded-md flex items-center">
              +
            </button>

            <button onClick={prevInQueue} className="flex text-black px-4 py-2 rounded-md">
              {prevMediaStack.length > 0 ? "" : <MdNotInterested />}
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

            <button onClick={nextInQueue} className={`flex text-black px-4 py-2 rounded-md`}>
              <AiOutlineArrowRight />
              {queue.length > 0 ? "" : <MdNotInterested />}
            </button>

            <select value={playbackRate} onChange={(e) => handlePlaybackRateChange(Number(e.target.value))} className="bg-white text-black p-1 rounded-md">
              <option value="0.25">0.25x</option>
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option defaultChecked value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
              <option value="3">3x</option>
              <option value="4">4x</option>
            </select>

            <button onClick={() => handleSeek(0)} className="bg-blue-500 text-black px-4 py-2 rounded-md">
              <FiRotateCw />
            </button>

            <button onClick={toggleMinimize} className="bg-blue-500 text-black px-4 py-2 rounded-md">
              {isMinimized ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />}
            </button>

            <button onClick={toggleFullScreen} className="bg-blue-500 text-black px-4 py-2 rounded-md">
              <MdFullscreen />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ControlButtons;
