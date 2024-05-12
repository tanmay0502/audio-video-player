import { render, screen } from '@testing-library/react';
import MediaScreen from '@/components/MediaScreen';

describe('MediaScreen component', () => {
  test('renders MediaScreen component without crashing', () => {
    render(<MediaScreen />);
    const linkElement = screen.getByText(/Audio\/Video Player/i) as HTMLElement;
    expect(linkElement).toBeInTheDocument();
  });

  test('renders "Upload a file or select from sample media" text', () => {
    render(<MediaScreen />);
    const uploadText = screen.getByText(/Upload a file or select from sample media/i) as HTMLElement;
    expect(uploadText).toBeInTheDocument();
  });

  test('renders "Video will be displayed here" text when no file is selected', () => {
    render(<MediaScreen />);
    const videoText = screen.getByText(/Video will be displayed here/i) as HTMLElement;
    expect(videoText).toBeInTheDocument();
  });
});
