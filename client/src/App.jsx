import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home' ;
import SignIN from './pages/SignIN.JSX';
import SignUp from './pages/SignUp' ;
import Profile from './pages/Profile';
import About from './pages/About';
import Header from './components/Header';

function App() {
  return (
    <BrowserRouter>
      <Header/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/sign-in' element={<SignIN/>}/>
          <Route path='/sign-up' element={<SignUp/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/profile' element={<Profile/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default App ;