import React from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {useNavigate, useParams} from 'react-router-dom'
import {useAppStore} from '../../../../../server/store/index.js'
import {toast} from 'sonner'
import {apiClient} from '@/lib/api-client'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { CaretSortIcon } from "@radix-ui/react-icons"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
  DialogClose
} from "@/components/ui/dialog"


function ContactsContainer() {

  //   const [profileImage, setProfileImage] = useState('')
  const navigate = useNavigate()
  const params = useParams()
  const {users,setUser,setSelectedChatType,setSelectedChatData,setSelectedChatMessages} = useAppStore()
  const [isOpenDM, setIsOpenDM] = React.useState(false)
  const [isOpenCT, setIsOpenCT] = React.useState(false)
  const [searchedContacts, setSearchedContacts] = React.useState([])

  const fetchUser = async () => {
    console.log("here")
    const response=await apiClient.get('api/auth/user-info',{withCredentials:true})
    console.log(response)
    setUser(response.data);
  }

  
  const handleLogout = async () => {
    try {
      const response= await apiClient.post('api/auth/logout',{},{withCredentials:true})
      if(response.status === 200){
        toast.success('Logout successful')
        navigate("/auth")  //Check karo idhar gadbad kyu horha?
        setUser({users: null});
      }
    } catch (error) {
      console.log(error)
      toast.error('Error deleting chat')
    }
  }

  // let imgPathContact="";

  const searchContact=async(searchTerm)=>{
    if(searchTerm.length>0){
      const response=await apiClient.post(`api/contacts/search`,{searchTerm},{withCredentials:true})

      if(response.status === 200){
        console.log("Found")
        setSearchedContacts(response.data)
        // imgPathContact=`../../../server/${response.data.image}`
      }

    }
  }

  const chatWithContact=async(contact)=>{
    setSelectedChatType("contact")
    setSelectedChatData(contact)
    setSelectedChatMessages([])
    searchedContacts.length=0;

    // navigate(`/chat/${contact._id}`)
  } 

  let imgPath=`../../../server/${users.image}`

  return (
    <div className="h-full w-1/4 bg-slate-900 fixed left-0 top-0">
      <div className="flex  items-center h-20 p-4">
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-11 h-12">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier"> 
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16L3.54223 12.3383C1.93278 11.0162 1 9.04287 1 6.96005C1 3.11612 4.15607 0 8 0C11.8439 0 15 3.11612 15 6.96005C15 9.04287 14.0672 11.0162 12.4578 12.3383L8 16ZM3 6H5C6.10457 6 7 6.89543 7 8V9L3 7.5V6ZM11 6C9.89543 6 9 6.89543 9 8V9L13 7.5V6H11Z" fill="#FFFFFF"></path> 
          </g>
        </svg>
          <h1 className='m-4 text-5xl font-bold text-purple-500'>ChatApp</h1>
      </div>
      <div className='flex flex-col items-start space-y-2'>
      <Dialog>
      <TooltipProvider>
        <Tooltip content="Start a conversation with someone">
          <DialogTrigger asChild>
            <Button
              className="text-sm m-2 p-4 text-white hover:text-purple-500 font-thin"
              onClick={() => setIsOpenDM(true)}
            >
              DIRECT MESSAGES
            </Button>
          </DialogTrigger>
        </Tooltip>
        <Tooltip content="Start a conversation with a group">
          <DialogTrigger asChild>
            <Button
              className="text-sm m-2 p-4 text-white hover:text-purple-500 font-extralight"
              onClick={() => setIsOpenCT(true)}
            >
              CHANNELS
            </Button>
          </DialogTrigger>
        </Tooltip>
      </TooltipProvider>
      </Dialog>  
      </div>
      <Dialog open={isOpenDM} onOpenChange={setIsOpenDM}>
        <DialogOverlay className="fixed inset-0 bg-black/30" />
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white rounded">
          <DialogTitle>Direct Messages</DialogTitle>
          <DialogDescription>
            Start a conversation with someone
          </DialogDescription>
          <form className="space-y-4">
            <label>
              <span className="block mb-2" >Name</span>
              <div className="relative">
                <input type="text" className="block w-full px-4 py-2 border-2 rounded" onChange={(e)=>{searchContact(e.target.value)}} />
                {searchedContacts.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white shadow-lg rounded">
                    {searchedContacts.map(contact => (
                      <li className="px-4 py-2 hover:bg-gray-100" key={contact._id} onClick={()=> {chatWithContact(contact)}}>
                        <img src={`../../../server/${contact.image}`} className="w-8 h-8 rounded-full mr-2" />
                        <span className="font-semibold">{contact.firstName} {contact.lastName}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </label>
            <div className="flex justify-end">
              <DialogClose asChild>
                <Button className="px-4 py-2 rounded">Send</Button>
              </DialogClose>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isOpenCT} onOpenChange={setIsOpenCT}>
        <DialogOverlay className="fixed inset-0 bg-black/30" />
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white rounded">
          <DialogTitle>Channels</DialogTitle>
          <DialogDescription>
            Start a conversation with a group
          </DialogDescription>
          <form className="space-y-4">
            <label>
              <span className="block mb-2">Name</span>
              <input type="text" className="block w-full px-4 py-2 border-2 rounded" />
            </label>
            <div className="flex justify-end">
              <DialogClose asChild>
                <Button className="px-4 py-2 rounded">Send</Button>
              </DialogClose>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className='fixed flex w-full bottom-0 flex-col items-start justify-center'>
      <div className='flex items-center w-1/4  justify-between p-4 bg-slate-800'>
        <Avatar className="w-10 h-10 bg-white">
          <AvatarImage className="w-10 h-10" src={imgPath} />
          <AvatarFallback delayMs={600} className="text-xl hover:hidden"> {users.firstName ? users.firstName[0] : fetchUser()} {users.lastName ? users.lastName[0] : fetchUser()}  </AvatarFallback>
        </Avatar>
        <p className='text-xl text-white font-semibold'>{users.userName}</p>
        <Button className=' text-white rounded-xl hover:bg-purple-500 justify-center items-end ' onClick={() => navigate(`/profile`)}
              variant='ghost' color='gray'>
              Info
        </Button>
        <Button className=' text-white rounded-xl hover:bg-purple-500 justify-center items-end ' onClick={() => handleLogout()}
              variant='ghost' color='gray'>
              Logout
        </Button>
      </div>
      </div>
    </div>
  )
}

export default ContactsContainer
