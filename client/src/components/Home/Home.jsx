import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Navbar'
import './Home.css'
import Login from '../Login/Login'
import Register from '../Register/Register'
import Feed from './leftcontent/Options'
import Content from './middlecontent/Content'
import Rightbar from './rightcontent/Rightbar'
import Profile from '../Profile/YourProfile/Profile'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
export default function Home() {
    const { user: LoggedInUser } = useContext(AuthContext)
    const [friends, setFriends] = useState([]);
    useEffect(() => {
        const getFriends = async () => {
            try {
                const friendList = await axios.get("/users/friends/" + LoggedInUser._id);
                setFriends(friendList.data);
            } catch (err) {
                console.log(err.message);
            }
        };
        getFriends();
      },[LoggedInUser])
    const {user}=useContext(AuthContext)
    return (
        <>
            <Navbar />
            <div className="container">
                <Feed friends={friends}/>
                <Content user={user}/>
                <Rightbar/>
            </div>
        </>
    )
}
