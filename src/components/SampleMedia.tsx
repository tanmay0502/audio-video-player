import React from 'react';
import Image from 'next/image';

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
    { url: '/samples/sample1.mp4', type: 'video/mp4', thumbnail: '/thumbnails/audioThumbnail.png' },
    { url: '/samples/sample2.mp4', type: 'video/mp4', thumbnail: '/thumbnails/audioThumbnail.png' },
    { url: '/samples/sample3.mp4', type: 'video/mp4', thumbnail: '/thumbnails/audioThumbnail.png' },
    { url: '/samples/sample4.mp4', type: 'video/mp4', thumbnail: '/thumbnails/audioThumbnail.png' },
    { url: '/samples/sample5.mp3', type: 'audio/mpeg', thumbnail: '/thumbnails/audioThumbnail.png' },
    { url: '/samples/sample6.mp3', type: 'audio/mpeg', thumbnail: '/thumbnails/audioThumbnail.png' },
  ];

  return (
    <div className='flex flex-col'>
      {sampleFiles.map((file, index) => (
        <div key={index} className='my-2'>
          <Image
            src={file.thumbnail}
            alt={`Thumbnail ${index}`}
            width={100}
            height={100}
            className='cursor-pointer'
            onClick={() => handleFileSelect(file.url, file.type, file.thumbnail)}
          />
        </div>
      ))}
    </div>
  );
}
