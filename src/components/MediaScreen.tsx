"use client"
import React, { useState } from 'react';
import { MediaPlayer } from './MediaPlayer';
import { UploadMedia } from './UploadMedia';
import { SampleMedia } from './SampleMedia';

export default function MediaScreen() {
  const [selectedFile, setSelectedFile] = useState<string | undefined>();
  const [fileType, setFileType] = useState<string | undefined>();
  const [thumbnail, setThumbnail] = useState<string | undefined>();

  return (
    <div className='homescreen'>
      <div className='flex flex-col items-center m-8'>
        <p className="md:text-2xl text-lg font-bold mb-4 text-pocket-red">Pocket-FM-Assignment</p>
        <p className="md:text-2xl text-lg">Audio/Video Player</p>
        <p className="md:text-lg text-sm">Upload a file or select from sample media</p>
      </div>
      <div className="flex flex-col lg:flex-row mt-8 md:m-4">
        <div className="w-full lg:w-2/3 mb-4 lg:mb-0 lg:pr-4">
          
          {selectedFile ? (
            <MediaPlayer fileUrl={selectedFile} fileType={fileType} thumbnail={thumbnail} />
          ) : (
            <div className="bg-red-200 h-64 flex items-center justify-center">
              <p className="text-pocket-red text-lg">Video will be displayed here</p>
            </div>
          )}
          <UploadMedia setSelectedFile={setSelectedFile} setFileType={setFileType} setThumbnail={setThumbnail} />
        </div>
        <div className="w-full lg:w-1/3 lg:pl-4">
          <SampleMedia setSelectedFile={setSelectedFile} setFileType={setFileType} setThumbnail={setThumbnail} />
        </div>
      </div>
    </div>
  );
}
