import { render, screen } from '@testing-library/react';
import Sidebar from '../src/components/Sidebar';

describe('Sidebar', () => {
  it('renders New Chat button', () => {
    render(<Sidebar />);
    expect(screen.getByRole('button', { name: /new chat/i })).toBeInTheDocument();
  });

  it('renders conversation list items', () => {
    render(<Sidebar />);
    expect(screen.getByText(/previous conversation/i)).toBeInTheDocument();
    expect(screen.getByText(/another chat example/i)).toBeInTheDocument();
  });

  it('renders user account section', () => {
    render(<Sidebar />);
    expect(screen.getByText(/user account/i)).toBeInTheDocument();
  });
});
