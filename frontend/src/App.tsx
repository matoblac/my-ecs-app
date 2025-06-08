import './App.css'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'

function App() {

  return (
    <>
    <div className="flex h-screen w-screen">
      <Sidebar />
      <ChatWindow />
    </div>
    </>
  )
}

export default App
