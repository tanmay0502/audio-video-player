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
  