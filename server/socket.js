import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModel.js";

const setupSocket = (server) => {
    

    const io = new SocketIOServer(server, {
        cors: {
            origin: "http://localhost:5173",
            methods:["GET","POST"],
            credentials:true
        },
    });
      
    const userSocketMap=new Map();
    io.on("connection", (socket) => {
        console.log("Connected to socket")
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log("Connected", userId);
        } else {
            console.log("Disconnected, no userId provided");
        }

        socket.on("disconnect", () => {
            console.log("Disconnected from socket", socket.id);
            for (const [userId, socketId] of userSocketMap) {
                if (socketId === socket.id) {
                    userSocketMap.delete(userId);
                    break;
                }
            }
        });

        const sendMessage=async(message)=>{
            const senderSocketId=userSocketMap.get(message.sender);
            const receipentSocketID=userSocketMap.get(message.receipent);

            const createMessage=await Message.create(message);
            console.log(createMessage)

            

            const messageData=await Message.findById(createMessage.id).populate("sender").populate("receipent");
            console.log(messageData.sender)

            if(receipentSocketID){
                io.to(receipentSocketID).emit("receiveMessage",messageData);
            }

            if(senderSocketId){
                io.to(senderSocketId).emit("receiveMessage",messageData);
            }
        }

        socket.on("sendMessage",sendMessage)
    });
}

export default setupSocket
