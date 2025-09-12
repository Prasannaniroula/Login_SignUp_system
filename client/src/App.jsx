import React from 'react'
import { Routes, Route } from 'react-router-dom'
import  Home from './pages/homepage'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import Emailverify from './pages/Emailverify'
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div>
      <ToastContainer/>
       <Routes>
        <Route path='/' element= {<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/reset-password' element= {<ResetPassword/>}/>
        <Route path='/email-verify' element= {<Emailverify/>}/>
       </Routes>
      </div>
  )
}

export default App