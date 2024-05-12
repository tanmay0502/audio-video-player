import { useState } from 'react';
import { useQueue } from '@/hooks/useQueue';

type UploadMediaProps = {
  setSelectedFile: React.Dispatch<React.SetStateAction<string | undefined>>;
  setFileType: React.Dispatch<React.SetStateAction<string | undefined>>;
  setThumbnail: React.Dispatch<React.SetStateAction<string | undefined>>; 
};

export function UploadMedia({ setSelectedFile, setFileType, setThumbnail }: UploadMediaProps) {
  const { addToTop } = useQueue();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(URL.createObjectURL(event.target.files[0]));
      setFileType(event.target.files[0].type);
      setThumbnail("/thumbnails/audioThumbnail.png");

      const newMedia = {
        url: URL.createObjectURL(event.target.files[0]),
        type: event.target.files[0].type,
        thumbnail: "/thumbnails/audioThumbnail.png"
      };
       
      addToTop(newMedia);
    }
  }

  return (
    <div className="flex justify-center mb-4">
      <input 
        type="file" 
        accept="audio/*,video/*" 
        onChange={handleFileUpload} 
        className="bg-pocket-red p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
