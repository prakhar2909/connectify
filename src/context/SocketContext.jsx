 
import { createContext, useContext, useEffect, useRef } from "react" 
import { useAppStore } from "../../server/store/index.js";
import { io } from "socket.io-client";


const SocketContext = createContext(null);

export const useSocketContext = () => {
    return useContext(SocketContext)
}

export const SocketContextProvider = ({ children }) => {
    const socket=useRef();
    const {users,selectedChatMessages}=useAppStore();

    useEffect(() => {
        if(users){
            socket.current=io("http://localhost:8000",{
                withCredentials:true,
                query:{userId:users.id}
            })
            socket.current.on("connection",()=>{
                console.log("Connected to socket {From context jsx}")
            })

            const handleReceive=(message)=>{
                const {selectedChatData,selectedChatType,addMessage}= useAppStore.getState()
                console.log("Message Received",message);

                // console.log(
                //     selectedChatData.id
                // )
        
                if(selectedChatType !== undefined && ((selectedChatData.id===message.sender._id) || (selectedChatData.id===message.receipent._id))){
                    console.log(selectedChatMessages)
                    addMessage(message);
                }
            }

            socket.current.on("receiveMessage",handleReceive);

            return ()=>{
                socket.current.disconnect();
            }
        }
    }, [users])


    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
    
}
