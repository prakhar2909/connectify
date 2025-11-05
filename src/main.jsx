import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'sonner'
import { SocketContextProvider } from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <SocketContextProvider>
  <div className='w-screen h-screen'>
  <App />
  <Toaster closeButton={true} invert={true}/>
  </div>
  </SocketContextProvider>,
)
