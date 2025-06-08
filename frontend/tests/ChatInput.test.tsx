import { render, fireEvent, screen } from '@testing-library/react';
import ChatInput from '../src/components/ChatInput';

describe('ChatInput component', () => {
  it('renders the input field', () => {
    render(<ChatInput onSend={jest.fn()} />);
    expect(screen.getByPlaceholderText(/send a message/i)).toBeInTheDocument();
  });

  it('lets you type a message', () => {
    render(<ChatInput onSend={jest.fn()} />);
    const textarea = screen.getByPlaceholderText(/send a message/i);
    fireEvent.change(textarea, { target: { value: 'Hello world' } });
    expect(textarea).toHaveValue('Hello world');
  });

  it('calls onSend when Enter is pressed without Shift', () => {
    const onSend = jest.fn();
    render(<ChatInput onSend={onSend} />);
    const textarea = screen.getByPlaceholderText(/send a message/i);

    fireEvent.change(textarea, { target: { value: 'Hello' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

    expect(onSend).toHaveBeenCalledWith('Hello');
    expect(onSend).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onSend if message is empty', () => {
    const onSend = jest.fn();
    render(<ChatInput onSend={onSend} />);
    const textarea = screen.getByPlaceholderText(/send a message/i);
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });
    expect(onSend).not.toHaveBeenCalled();
  });

  it('allows new lines when Shift + Enter is pressed', () => {
    render(<ChatInput onSend={jest.fn()} />);
    const textarea = screen.getByPlaceholderText(/send a message/i);
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
    expect(textarea).toHaveValue('Hello'); // still in text area, not submitted
  });

  it('clears the textarea after sending a message', () => {
    const onSend = jest.fn();
    render(<ChatInput onSend={onSend} />);
    const textarea = screen.getByPlaceholderText(/send a message/i);

    fireEvent.change(textarea, { target: { value: 'Test message' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

    expect(textarea).toHaveValue('');
  });
});
