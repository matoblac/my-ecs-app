import { render, screen } from '@testing-library/react';
import ChatWindow from '../src/components/ChatWindow';

beforeAll(() => {
  // Avoid scrollIntoView crash
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

describe('ChatWindow', () => {
  it('renders ChatWindow with welcome screen and ChatInput', () => {
    render(<ChatWindow />);

    // Header check
    expect(screen.getByText(/Allen/i)).toBeInTheDocument();

    // Input area
    expect(screen.getByPlaceholderText(/send a message/i)).toBeInTheDocument();
  });
});
