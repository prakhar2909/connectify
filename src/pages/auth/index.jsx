import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/sonner"
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../../server/store/index.js'




function Auth() {

  const navigate=useNavigate()
  const {users,setUser}=useAppStore()
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmpassword, setConfirmPassword] = useState("")

  const validateSignup=()=>{
    if(!email.length){
      toast.error("Email is required")
      return false;
    }

    if(!password.length){
      toast.error("Password is required")
      return false;
    }

    if(!username.length){
      toast.error("Username is required")
      return false;

    }
    if(password !== confirmpassword){
      toast.error("Passwords do not match")
      return false;
    }
    return true
  }

  const validateLogin=()=>{
    if(!email.length){
      toast.error("Email is required")
      return false;
    }
    if(!password.length){
      toast.error("Password is required")
      return false;

    }
    return true
  }

  const handleLogin=async ()=>{
    if(validateLogin()){
      const response =await apiClient.post('api/auth/login', {email,password},{withCredentials:true})
      console.log(response)

    if(response.status === 200){
      console.log(response.data)
      setUser(response.data)
      navigate("/profile");

      // if(response.data.profilesetup){
      //   navigate("/chat");
      // }
      // else{
      //   navigate("/profile");
      // }

      }
    }
  }

  const handleSignup =async ()=>{
    if(validateSignup()){
      const response =await apiClient.post('api/auth/signup', {email,password,username},{withCredentials:true})
      console.log(response)
    if(response.status === 201){
      setUser(response.data)
      // console.log("kush")

      navigate("/profile");
    }
    }
  }

  // console.log("kush")

  return (
  <div className="flex justify-center items-center h-screen bg-slate-500">

    <Tabs defaultValue="Login" className="w-[400px] bg-white">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="Login">Login</TabsTrigger>
        <TabsTrigger value="Signup">Signup</TabsTrigger>
      </TabsList>
      <TabsContent value="Login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Login to your account here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue="" type="email" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" defaultValue="" type="password" onChange={(e) => setPassword(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="bg-slate-700 text-white hover:bg-slate-700" onClick={()=>{handleLogin()}}>Login</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="Signup" >
        <Card>
          <CardHeader>
            <CardTitle>SignUp</CardTitle>
            <CardDescription>
              SignUp to your account here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
          <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue="" type="email" onChange={(e) => setEmail(e.target.value)} />
            </div>
          <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="" onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" defaultValue="" type="password" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="cpassword">Confirm Password</Label>
              <Input id="cpassword" defaultValue="" type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="bg-slate-700 text-white hover:bg-slate-700" onClick={()=>{handleSignup()}}>SignUp</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>

  </div>
  )
}

export default Auth