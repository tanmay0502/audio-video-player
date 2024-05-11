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
    <div>
      <UploadMedia setSelectedFile={setSelectedFile} setFileType={setFileType} />
      <MediaPlayer fileUrl={selectedFile} fileType={fileType} thumbnail={thumbnail} />
      <SampleMedia setSelectedFile={setSelectedFile} setFileType={setFileType} setThumbnail={setThumbnail} />
    </div>
  );
}
