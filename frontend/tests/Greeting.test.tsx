import { render, screen } from '@testing-library/react';
import Greeting from '../src/components/Greeting';

test('renders the name in greeting', () => {
  render(<Greeting name="Craig" />);
  expect(screen.getByText('Hello, Craig!')).toBeInTheDocument();
});

test('renders different names correctly', () => {
  render(<Greeting name="Alice" />);
  expect(screen.getByText('Hello, Alice!')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello, Alice!');
});
