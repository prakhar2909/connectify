import React from 'react'
import { Button } from './components/ui/button'
import { BrowserRouter , Routes, Route} from 'react-router-dom'
import  Auth  from "./pages/auth/index.jsx"
import { Navigate } from 'react-router-dom'
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from '../server/store/index.js'
import { apiClient } from './lib/api-client'
import { useState,useEffect } from 'react'

const PrivateRoute=({children})=>{
  // return children

  const {users}=useAppStore();
  console.log("pr")

  const isAuthenticated=users.id
  console.log(users)
  // if(isAuthenticated) console.log("k")

  return isAuthenticated ? children : <Navigate to="/auth" />
}

const AuthRoute=({children})=>{
  // return children
  const {users}=useAppStore();
  // console.log("ar")

  const isAuthenticated=users.id

  return isAuthenticated ? <Navigate to="/chat"/> : children 
}

function App() {

  const {users,setUser}=useAppStore();
  const [loading, setLoading] = useState(true)

  const getUser=async()=>{
    try {
      const response=await apiClient.get('api/auth/user',{withCredentials:true})
      if(response.status=== 200){
        setUser(response.data)
      }
      else{
        setUser(undefined)
      }
    } catch (error) {
      console.log(error)
      setUser(undefined)
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    if(!users){
      getUser()
    }
    else{
      setLoading(false)
    }
    
  }, [users,setUser])

  if(loading){
    return <>Loading...</>
  }

  return (
    <div className='bg-slate-900 w-full h-full'>
      <BrowserRouter>
        <Routes>

          <Route  path="/auth" 
          element={
            <AuthRoute>
              <Auth/>
            </AuthRoute>} 
          />

          <Route  path="/profile" 
          element={
            <PrivateRoute> 
              <Profile/> 
            </PrivateRoute>} 
          />

          <Route  path="/chat" 
          element={
            <PrivateRoute> 
              <Chat/> 
            </PrivateRoute>} 
          />

          <Route  path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App