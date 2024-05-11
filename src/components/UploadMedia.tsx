"use client"
import { useState } from 'react';

type MediaPlayerProps = {
    fileUrl: string | undefined;
    fileType: string | undefined;
  };
  
  export function MediaPlayer({ fileUrl, fileType }: MediaPlayerProps) {
    const isVideo = fileType && (fileType === 'video/mp4' || fileType === 'video/webm');
    const isAudio = fileType && (fileType === 'audio/mpeg' || fileType === 'audio/wav');
  
    return (
      <div>
        {isVideo && <>VIDEO: <video src={fileUrl} controls autoPlay /></>}
        {isAudio && <>AUDIO: <audio src={fileUrl} controls autoPlay /></>}
      </div>
    );
  }
  
  type UploadMediaProps = {
    setSelectedFile: React.Dispatch<React.SetStateAction<string | undefined>>;
    setFileType: React.Dispatch<React.SetStateAction<string | undefined>>;
  };
  
  export function UploadMedia({ setSelectedFile, setFileType }: UploadMediaProps) {
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        setSelectedFile(URL.createObjectURL(event.target.files[0]));
        setFileType(event.target.files[0].type);
      }
    };
  
    return (
      <div>
        <input type="file" accept="audio/*,video/*" onChange={handleFileUpload} />
      </div>
    );
  }
  