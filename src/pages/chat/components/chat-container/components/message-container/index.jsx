import React from 'react'
import {useAppStore} from '../../../../../../../server/store/index.js'
import moment from 'moment';
import { useRef , useEffect } from 'react';
import { apiClient } from '@/lib/api-client.js';

function MessageContainer() {

  const scrollRef = useRef();
  const{ selectedChatType,selectedChatData,selectedChatMessages,setSelectedChatMessages,addMessage}=useAppStore.getState()


  useEffect(() => {
    const getMessages= async()=>{
      try {
        const response=await apiClient.post(`/api/messages/get-message`,{id:selectedChatData.id},{withCredentials:true});
        // console.log("response",response);

        if(response.status===200){
          setSelectedChatMessages(response.data);
        }

      } catch (error) {
        console.log(error);
      }
    }

    if(selectedChatData.id){
      if(selectedChatType==="contact"){
        getMessages();
      }
    }
    
  }, [
    selectedChatData,
    selectedChatType,
    setSelectedChatMessages
  ])
  

  useEffect(() => {
    if(scrollRef.current){
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
      scrollRef.current.style.scrollBehavior = "smooth";
      scrollRef.current.style.transition = "all 0.5s ease-in-out";
    }
  }, [selectedChatMessages])


  


  const renderMessage= ()=>{
    let lastDate=null;
    console.log("rendering");
    console.log("selectedChatMessages",selectedChatMessages);

    return selectedChatMessages.map((message,index)=>{

      // console.log("Message is",message);
      // console.log(message.content);

      const messageDate=moment(message.timestamp).format("YYYY-MM-DD");
      const showDate= messageDate!==lastDate;
      lastDate=messageDate;

      return (
        <div key={index} className="flex flex-col break-words rounded-lg shadow-md p-4 m-2">
          {showDate && <div className="p-4 m-2 text-sm font-semibold text-gray-500">{moment(message.timestamp).format("LL")}</div>}
          {selectedChatType==="contact" && renderDmMessage(message)}
        </div>

      )
    })
  };

  const renderDmMessage= (message)=> {
    return (
      <div className={`${message.sender===selectedChatData.id ? "text-left" : "text-right"}`}>
        { 
          message.messageType==="text" && (
            <div className={`rounded-lg p-2 text-white text-xl`}>
              {message.content}
            </div>
          )
        }

        { 
          message.messageType==="file" && (
            <div className={`rounded-lg p-2 text-white text-xl`}>
              <a href={message.fileUrl} target="_blank" rel="noreferrer">
              {message.fileUrl}
              </a>
            </div>
          )
        }

        <div className=' text-gray-700 text-sm p-2'>{moment(message.timestamp).format("LT")}</div>
      </div>

    )
  }


  return (
    <div className="h-full overflow-y-auto" style={{ paddingBottom: '8rem' }}> 
      {renderMessage()} 
      <div ref={scrollRef}/>
    </div>
  )
}

export default MessageContainer