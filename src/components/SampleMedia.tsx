"use client"
import React from 'react';

type SampleMediaProps = {
  setSelectedFile: React.Dispatch<React.SetStateAction<string | undefined>>;
  setFileType: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export function SampleMedia({ setSelectedFile, setFileType }: SampleMediaProps) {
  const handleFileSelect = (fileUrl: string, fileType: string) => {
    setSelectedFile(fileUrl);
    setFileType(fileType);
  };

  const sampleFiles = [
    { url: '/samples/sample1.mp4', type: 'video/mp4' },
    { url: '/samples/sample2.mp3', type: 'audio/mpeg' },
  ];

  return (
    <div>
      {sampleFiles.map((file, index) => (
        <button key={index} onClick={() => handleFileSelect(file.url, file.type)}>
          Select {file.url}
        </button>
      ))}
    </div>
  );
}
