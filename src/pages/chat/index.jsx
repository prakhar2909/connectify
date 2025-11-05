// import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../../../server/store/index.js'
import { toast } from 'sonner';
import { useEffect } from 'react';
import ContactsContainer from './components/contacts-container/index.jsx';
import EmptyChatContainer from './components/empty-chat-container/index.jsx';
import ChatContainer from './components/chat-container/index.jsx';

function Chat() {
  // const param=useParams()
  const {users,selectedChatType}=useAppStore();
  const navigate=useNavigate();

  // console.log(users)

  useEffect(() => {
    if(!(users.profilesetup)){
      toast.error("Please setup your profile")
      navigate("/profile")
    }
  }, [users,navigate])

  console.log(selectedChatType)
  
  return (
    <div>
      <ContactsContainer/> 
      {selectedChatType === undefined ? <EmptyChatContainer/> : <ChatContainer/>}
      {/* <ChatContainer/> */}
    </div>
  )
}

export default Chat