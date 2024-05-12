"use client"
import { useState, useContext, createContext, ReactNode } from 'react';

interface Media {
  url: string;
  type: string;
  thumbnail: string;
}

export const QueueContext = createContext<{
  queue: Media[];
  prevMediaStack: Media[];
  addToQueue: (media: Media) => void;
  addToTop: (media: Media) => void;
  removeFromQueue: (media: Media) => void;
  nextInQueue: () => Media | undefined;
  prevInQueue: () => Media | undefined;
  clearQueueAndStack: () => void;
}>({
  queue: [],
  prevMediaStack: [],
  addToQueue: () => {},
  removeFromQueue: () => {},
  nextInQueue: () => undefined,
  prevInQueue: () => undefined,
  addToTop: () => {},
  clearQueueAndStack: () => {},
});

export function QueueProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<Media[]>([]);
  const [prevMediaStack, setPrevMediaStack] = useState<Media[]>([]);

  const addToQueue = (media: Media) => {
    setQueue((prevQueue) => [...prevQueue, media]);
  };

  const addToTop = (media: Media) => {
    setQueue((prevQueue) => [media, ...prevQueue]);
  };

  const clearQueueAndStack = () => {
    setQueue([]);
    setPrevMediaStack([]);
  };

  const removeFromQueue = (media: Media) => {
    setPrevMediaStack((prevStack) => [media, ...prevStack]); 
    setQueue((prevQueue) => prevQueue.filter((m) => m.url !== media.url));
  };

  const nextInQueue = (): Media | undefined => {
    if (queue.length > 0) {
      const [nextMedia, ...rest] = queue;
      setPrevMediaStack((prevStack) => [nextMedia, ...prevStack]);
      setQueue(rest);
      return nextMedia;
    }
    return undefined;
  };

  const prevInQueue = (): Media | undefined => {
    if (prevMediaStack.length > 0) {
      const [prevMedia, ...rest] = prevMediaStack;
      setPrevMediaStack(rest);
      addToTop(prevMedia);
  
      return prevMedia;
    }
    return undefined;
  };
  const value = { queue, prevMediaStack, addToQueue, removeFromQueue, nextInQueue, prevInQueue, clearQueueAndStack, addToTop };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
}
