import React from 'react'
import ChatHeader from '../chat-container/components/chat-header/index.jsx'
import MessageBar from './components/message-bar'
import MessageContainer from './components/message-container'

function ChatContainer() {
  return (
    <>
    <div className="fixed top-0 right-0 h-full w-3/4 p-6 space-y-4 border-l border-gray-300">
      <ChatHeader/>
      <MessageContainer/>
      <MessageBar/>
    </div>
    </>
  )
}

export default ChatContainer