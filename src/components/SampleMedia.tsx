import React from 'react';

type SampleMediaProps = {
  setSelectedFile: React.Dispatch<React.SetStateAction<string | undefined>>;
  setFileType: React.Dispatch<React.SetStateAction<string | undefined>>;
  setThumbnail: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export function SampleMedia({ setSelectedFile, setFileType, setThumbnail }: SampleMediaProps) {
  const handleFileSelect = (fileUrl: string, fileType: string, thumbnailUrl: string) => {
    setSelectedFile(fileUrl);
    setFileType(fileType);
    setThumbnail(thumbnailUrl);
  };

  const sampleFiles = [
    { url: '/samples/sample1.mp4', type: 'video/mp4', thumbnail: '' },
    { url: '/samples/sample2.mp3', type: 'audio/mpeg', thumbnail: '/thumbnails/audioThumbnail.png' },
  ];

  return (
    <div>
      {sampleFiles.map((file, index) => (
        <button key={index} onClick={() => handleFileSelect(file.url, file.type, file.thumbnail)}>
          Select {file.url}
        </button>
      ))}
    </div>
  );
}
