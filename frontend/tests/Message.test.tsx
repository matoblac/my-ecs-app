
import { render, screen } from '@testing-library/react';
import Message from '../src/components/Message';


describe('Message', () => {
  it('renders user message with correct content and avatar', () => {
    render(<Message role="user" content="Hello, Claude!" />);
    expect(screen.getByText('Hello, Claude!')).toBeInTheDocument();
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
  });

  it('renders assistant message with correct content and avatar', () => {
    render(<Message role="assistant" content="Hi, how can I assist you today?" />);
    expect(screen.getByText(/assist you today/i)).toBeInTheDocument();
    expect(screen.getByTestId('assistant-icon')).toBeInTheDocument();
  });
});

