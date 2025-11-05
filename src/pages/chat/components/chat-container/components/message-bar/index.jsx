import React, { useState, useRef, useEffect } from 'react';
import Picker from '@emoji-mart/react';
import { useAppStore } from '../../../../../../../server/store/index.js';
import { SocketContextProvider, useSocketContext } from '@/context/SocketContext';
import { apiClient } from '@/lib/api-client.js';

function MessageBar() {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);
  const pickerRef = useRef(null); // Reference for the emoji picker
  const socket= useSocketContext();
  const {selectedChatType,selectedChatData,users,addMessage}=useAppStore();
  const fileInputRef = useRef();

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim().length > 0) {
      console.log('Sending message:', text);
      setText('');
      inputRef.current.focus();
    }
  };

  const handleEmojiSelect = (emoji) => {
    setText(text + emoji.native);
    inputRef.current.focus();
  };

  // Toggle the emoji picker
  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  // Handle clicks outside the emoji picker to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false); // Close the emoji picker
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);


  const handleSend = async (message) => {
    console.log(`Send from button ${message}, ${users.id} ${selectedChatType} ${selectedChatData.id}`);
    // addMessage(message);
    if (socket && selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: users.id,
        receipent: selectedChatData.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
      });
    }
  }

  const handleFileChange=async (e)=>{
    try {
      const file=e.target.files[0];
      if(file){
        const formData=new FormData();
        formData.append("file",file);

        const res=await apiClient.post("/api/messages/get-file",formData,{withCredentials:true});

        if(res.status===200 && res.data){
          if(selectedChatType==="contact"){
            socket.emit("sendMessage", {
              sender: users.id,
              receipent: selectedChatData.id,
              content: undefined,
              messageType: "file",
              fileUrl: res.data.filePath,
            });
          }

        }
      }
      
    } catch (error) {
      console.log(error)
    }
    
  }

  

  return (
    <form className="fixed bottom-0 left-1/4 w-3/4 flex items-end" onSubmit={handleSubmit}>
      <input
        type="text"
        className="w-full px-2 py-2 rounded-md bg-white"
        placeholder="Type a message..."
        value={text}
        onChange={handleChange}
        ref={inputRef}
      />

      <button
        type="button"
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md"
        onClick={toggleEmojiPicker} // Toggle the emoji picker when the button is clicked
      >
        😀
      </button>
      
      <input
        type="file"
        className="hidden"
        id="file-input"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      <label htmlFor="file-input">
        <button
          type="button"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md"
          onClick={() => fileInputRef.current.click()}
        >
          📁
        </button>
      </label>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        onClick={()=>handleSend(text)}
      >
        Send
      </button>

      {showEmojiPicker && (
        <div ref={pickerRef}>
          <Picker
            onEmojiSelect={handleEmojiSelect}
            style={{
              position: 'absolute',
              bottom: '100px',
              right: '50px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              padding: '1rem',
            }}
            perLine={9}
          />
        </div>
      )}
    </form>
  );
}

export default MessageBar;
