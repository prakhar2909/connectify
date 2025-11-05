import React, { useRef } from 'react'
import { useAppStore } from '../../../server/store/index.js'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client.js';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {} from "../../../server/uploads/profiles/1728995340071-WhatsApp Image 2024-08-21 at 8.14.17 PM.jpeg"


function Profile() {

  const fileInputRef=useRef();


  const navigate=useNavigate();
  const {users,setUser}=useAppStore();
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")  
  const [image, setImage] = useState("")
  const[hovered,setHovered]=useState(false)
  const [selectedColor, setSelectedColor] = useState("white")

  useEffect(() => {
    if(users.profilesetup){
      setFirstName(users.firstName)
      setLastName(users.lastName)
    }

    if(users.image){
      setImage(users.image)
      setDlt("")
    }
  }, [users])

  const [dlt, setDlt] = useState("hidden")


  const validateprofile=()=>{
    if(!firstName.length){
      toast.error("First Name is required")
      return false
    }
    if(!lastName.length){
      toast.error("Last Name is required")
      return false
    }
    return true
  }

  const saveChanges= async ()=>{
    if(validateprofile()){
      toast.success("Changes Saved")
      console.log("Changes Saved")
      try {
        const response=await apiClient.post("api/auth/updateprofile",{firstName,lastName,image},{withCredentials:true})
        console.log(response.data)
        if(response.status===200){
          setUser(response.data);
          toast.success("Changes Saved")
          console.log(users)
          console.log(response)
          navigate("/chat")
        }
      } catch (error) {
        console.log(error)
      }
    }

  }

  const navChat=()=>{
    if(users.profilesetup) navigate("/chat")
    else{
      toast.error("Please setup your profile")
      navigate("/profile")
    }
  }

  const handleImage= async(e)=>{
    
    const file=e.target.files[0]
    console.log(file)
    if(e.target.files[0]){
      const data=new FormData();
      data.append('image',file);
      console.log(data)
      setDlt("");
      const response=await apiClient.post("api/auth/upload-image",data,{withCredentials:true})

      if(response.status===200){
        console.log(response.data)
        setUser(response.data)
        toast.success("Image uploaded")
        console.log(users)
      }


    }
    
  }


  let imgPath=`../../../server/${image}` //Nice Technique

  const handleDelete=async (e)=>{
    const response=await apiClient.delete("api/auth/delete-image",{withCredentials:true})
    console.log(response.status);
    if(response.status === 200){
      setDlt("hidden")
      setImage("")
      imgPath="";
      console.log(imgPath)
      setUser(response.data)
      toast.success("Image Deleted")
      console.log(users)
    }
  }


  return (
    <div className='flex items-center align-middle justify-center h-full w-full '>
     
      <div className="flex space-x-5 justify-center items-center rounded-xl p-4">
        <div onMouseEnter={()=> {setHovered(true)}} onMouseLeave={()=> setHovered(false)}>
        <Avatar className="w-32 h-32 " style={{backgroundColor:selectedColor}}>
          {hovered && (
            <div className="absolute inset-0 flex items-center justify-center ">
              <label htmlFor="image-upload" className="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-black-500 hover:text-black-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                </svg>
              </label>
              <input type="file" ref={fileInputRef} id="image-upload" accept='.jpg, .jpeg, .png, .webp' className="hidden" onChange={(e)=>handleImage(e)} />
            </div>
          )}
          <AvatarImage className="w-200 h-200" src={imgPath} />
          <AvatarFallback delayMs={600} className="text-3xl hover:hidden"> {firstName[0]} {lastName[0]}  </AvatarFallback>
        </Avatar>
        </div>
        <div className="flex flex-col space-y-4">
          <input type="email" className="border p-4 rounded-xl " placeholder="Email" value={users.email} />
          <input type="text" className="border p-4 rounded-xl" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input type="text" className="border p-4 rounded-xl" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <Button className="border p-4 text-white text-md bg-purple-700 rounded-xl hover:bg-purple-800" style={{visibility:dlt}} onClick={()=>handleDelete()}> Delete Image</Button>
          
        </div>
        <div className='flex flex-col space-y-4'>
          <Button className="border p-4 text-white text-md bg-purple-700 rounded-xl hover:bg-purple-800" onClick={()=>saveChanges()}> Save Changes</Button>
          <Button className="border p-4  text-white text-md bg-purple-700 rounded-xl hover:bg-purple-800" onClick={()=>navChat()}> Chat!! </Button>
        </div>
      </div>
    </div>
  )
}

export default Profile


