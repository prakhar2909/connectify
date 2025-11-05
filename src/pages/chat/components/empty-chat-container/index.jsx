import React from 'react'
import BarLoader from '../Barloader'


function EmptyChatContainer() {
  return (
    <div className="fixed top-0 right-0 h-full w-3/4 p-6 space-y-4 border-l border-gray-300">
      <div className="flex items-center justify-center h-full">
        <h1 className="text-5xl font-bold text-white m-10"> 💬Let's start </h1>
        <h1 className="text-6xl font-bold text-purple-500">
          Chatting 
        </h1>
        <BarLoader/>
      </div>
    </div>
  )
}

export default EmptyChatContainer
