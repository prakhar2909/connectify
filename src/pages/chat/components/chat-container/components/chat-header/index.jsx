import React from 'react'
import {useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {useAppStore} from '../../../../../../../server/store/index.js'
import {toast} from 'sonner'
import {apiClient} from '@/lib/api-client'
import {Button} from '../../../../../../components/ui/button.jsx'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import {Icon} from '../../../../../../components/ui/icon.jsx'
import {useEffect} from 'react'


function ChatHeader() {
//   const [profileImage, setProfileImage] = useState('')
  const navigate = useNavigate()
  const params = useParams()
  const {users,setUser,selectedChatType,selectedChatData,selectedChatMessages} = useAppStore()

  const fetchUser = async () => {
    console.log("here")
    const response=await apiClient.get('api/auth/user-info',{withCredentials:true})
    console.log(response)
    setUser(response.data);
  }

  
  const handleDeleteChat = async () => {
    try {
      await apiClient.delete(`/api/chats/${params.chatId}`)
      toast.success('Chat deleted successfully')
      navigate('/chat')
    } catch (error) {
      console.log(error)
      toast.error('Error deleting chat')
    }
  }
  let imgPath=`../../../server/${selectedChatData.image}`

  return (
    <div className='flex items-center justify-end p-4 border-b border-gray-300'>
      <div className='absolute top-0 left-0 flex w-1/2  justify-start items-center p-4'>
        <Avatar className="w-10 h-10 m-4 bg-white">
          <AvatarImage className="w-10 h-10" src={imgPath} />
          <AvatarFallback delayMs={600} className="text-xl hover:hidden"> {selectedChatData.firstName} {selectedChatData.lastName}  </AvatarFallback>
        </Avatar>
        <p className='text-xl text-white font-semibold'>{selectedChatData.firstName} {selectedChatData.lastName}</p>
      </div>
      <div className='flex items-end'>
        <Button onClick={handleDeleteChat} variant='destructive' color='red' className='text-white hover:bg-red-500 rounded-xl'>
          {/* <Icon name='trash' className='w-6 h-6 mr-2' /> */}
          Delete
        </Button>
      </div>
    </div>
  )
}

export default ChatHeader
