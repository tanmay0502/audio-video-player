import MediaScreen from '../components/MediaScreen';
import { QueueProvider } from '@/hooks/useQueue';

export default function Home() {
  return (
    <div>
      <QueueProvider> 
        <MediaScreen />
      </QueueProvider>
    </div>
  );
}
