// src/pages/chat/chat.test.tsx
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { render, screen } from '@testing-library/react'
import { Chat } from '../src/pages/chat/chat'


// Mock WebSocket
class MockWebSocket {
  static OPEN = 1
  readyState = MockWebSocket.OPEN
  addEventListener = jest.fn()
  removeEventListener = jest.fn()
  send = jest.fn()
  close = jest.fn()
}
global.WebSocket = MockWebSocket as any

describe('Chat', () => {
  it('renders without crashing', () => {
    render(<Chat />)
    // Expect overview or header to render
    // Adjust to match your Overview text!
    expect(screen.getByText(/allen.ai/i)).toBeInTheDocument()
  })
})
