// import { reset } from "nodemon";

import { Receipt } from "lucide-react";

export const createChatSlice= (set,get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages:[],
    setSelectedChatType: (selectedChatType) => set({selectedChatType}),
    setSelectedChatData: (selectedChatData) => set({selectedChatData}),
    setSelectedChatMessages: (selectedChatMessages) => set({selectedChatMessages}),

    closeChat: () => {
        set({selectedChatType: undefined})
        set({selectedChatData: undefined})
        set({selectedChatMessages: []})
    },
    addMessage:(message)=>{
        const selectedChatMessages=get().selectedChatMessages;
        const selectedChatType=get().selectedChatType;

        set({
            selectedChatMessages:[
                ...selectedChatMessages,
                {
                    message,
                    content: message.content,
                    messageType: message.messageType,
                    timestamp: message.timestamp,
                    receipent: selectedChatType==="channel" ? message.receipent:message.receipent._id,
                    sender: selectedChatType==="channel" ? message.sender:message.sender._id,
                }
            ],
        })
    }

})