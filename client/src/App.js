
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Profile from './components/Profile/YourProfile/Profile';

import Register from './components/Register/Register'
import {
  BrowserRouter,
  Routes,
  Route,
  Redirect,
  Link,
  Navigate
} from "react-router-dom";
import { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import Chat from './components/Chat/Chat';
function App() {
  const [cinvo,setconvo]=useState('');
  const {user}= useContext(AuthContext);
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route exact path='/login' element={user ? <Navigate to="/" /> : <Login />}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/' element={user?<Home/>:<Login/>}/>
        <Route path='/chat' element={!user?<Login/>:<Chat/>}/>
        <Route path='/profile/:username' element={<Profile convo={cinvo} setconvo={setconvo}/>}/>

      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
