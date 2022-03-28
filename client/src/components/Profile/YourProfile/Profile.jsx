import { AccessTime, Person, PersonAdd, School, Send, SettingsInputSvideoRounded } from '@material-ui/icons'
import React, { useContext, useEffect, useRef, useState } from 'react'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveAlt1Icon from '@mui/icons-material/PersonRemoveAlt1';
import './profile.css'
// import Post from '../../Home/middlecontent/Post/Post'
// import Feed from '../../Home/middlecontent/Feed/Feed'
import Navbar from '../../Navbar'
import axios from 'axios'
import Content from '../../Home/middlecontent/Content'
import { useParams } from 'react-router'
import { AuthContext } from '../../../context/AuthContext'
import { format } from 'timeago.js'
import { Link } from 'react-router-dom'
import { Avatar } from '@material-ui/core';

function Profile({convo,setconvo}) {
    const [User, setUser] = useState({})
    const [friends, setFriends] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const context = useContext(AuthContext)

    // console.log(context)
    const convoidRef = useRef();
    
    const loggedInUser = context.user;
    const dispatch = context.dispatch
    const username = useParams().username
    const [follow, setFollow] = useState(loggedInUser.following.includes(User?._id))
    useEffect(() => {
        const fetchuserposts = async () => {
            const user = await axios.get(`/users?username=${username?username:loggedInUser?.username}`)
            setUser(user.data)
        }
        fetchuserposts()
    }, [username])
    useEffect(() => {
        const getFriends = async () => {
            try {
                const friendList = await axios.get("/users/friends/" + User._id);
                setFriends(friendList.data);
            } catch (err) {
                console.log(err.message);
            }
        };
        getFriends();

    }, [User,follow]);
    useEffect(() => {
        // console.log(User._id)
        setFollow(loggedInUser.following.includes(User?._id));
    }, [loggedInUser, User])
    // console.log(User,follow)
    // console.log(loggedInUser)
    // console.log(friends)
    const handleFollow = async () => {
        try {
            if (follow) {
                await axios.put(`/users/${User._id}/unfollow`, {
                    id: loggedInUser._id,
                });
                dispatch({ type: "UNFOLLOW", payload: User._id });
                console.log(convo)
                await axios.delete('/conversation/delete',{ data: { id:convo } })
                setconvo("");
            } else {
                await axios.put(`/users/${User._id}/follow`, {
                    id: loggedInUser._id,
                });
                dispatch({ type: "FOLLOW", payload: User._id });
                const data = await axios.post('/conversation',{
                    senderId:loggedInUser._id,
                    recieverId:User._id
                })
                setconvo(data.data._id)
            }
            setFollow(!follow);
        } catch (error) {
            console.log(error.message)
        }
    }
    console.log(convo)
    // console.log(follow)
    // console.log(User)
    const FriendElement = () => {
        return (
            <div className='friendproflie'>
                <h3>Friends</h3>
                <div className='friendElement'>
                    {
                        friends.map(friend => {
                            return (
                                <Link to={'/profile/' + friend.username} style={{ textDecoration: "none" }}>
                                    <div className='friend'>
                                        <Avatar className='friendpic' src={friend.profilepic ? `${PF}images/${friend.profilepic}` : PF + 'images/noAvatar.png'} alt="profilepic" />
                                        <p style={{ textTransfrom: "uppercase", maxWidth: "auto",marginLeft:'5px'}}>{friend.username}</p>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>

        )
    }
    const PersonalInfo = () => {
        return (
            <div  className='introproflie'>
                <h3>Personal info:</h3>
                <div  className='introElement1'>
                    <p style={{fontWeight:"bold"}}>City:</p>
                    <p>
                        {User.city}
                    </p>
                </div>
                <div  className='introElement1'>
                   <p style={{fontWeight:"bold"}}> Country:</p> 
                    <p> {User.country}</p>
                </div>
                <div className='introElement1'>
                    <p style={{fontWeight:"bold"}} >Relationship status:</p>
                    <p>{User.relation}</p>
                </div>
            </div>
        )
    }
    const Information = () => {
        return (
            <div className='introproflie'>
                <h3>Introduction</h3>
                <div className='introElement'>
                    <School className='introIcon' />
                    <p>
                        Studied M.Tech Integrated Software Engineering At <b>Vellore Institute of Technology</b>
                    </p>
                </div>
                <div className='introElement'>
                    <AccessTime className='introIcon' />
                    <p> Joined {format(User.createdAt)}</p>
                </div>
                <div className='introElement'>
                    <Person className='introIcon' />
                    <p> Followed by <b>{friends.length} People</b></p>
                </div>
            </div>
        )
    }
    const AboutElement = () => {
        return <div className='profileFeeddetails'>
            <Information />
            <PersonalInfo />
        </div>
    }
    return (
        <div >
            <Navbar />
            <div className='profilepicWrapper'>
                <div className='backgroundImg'>
                    <img className='background' style={{ borderRaduis: "0 0 10px 10px" }} src="https://www.poynter.org/wp-content/uploads/2019/01/background.png" alt="" />
                </div>
                <div>
                    <img className='profilePic' src="https://media.istockphoto.com/vectors/profile-placeholder-image-gray-silhouette-no-photo-vector-id1016744004?k=20&m=1016744004&s=612x612&w=0&h=Z4W8y-2T0W-mQM-Sxt41CGS16bByUo4efOIJuyNBHgI=" alt="" />

                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>

                    <div className="titleandmsg">
                        <div className='profileName'>
                            <p style={{ textTransform: "uppercase" }}><b>{User.username}</b> </p>
                            <span className='friendsCount'>{User.desc}</span>
                        </div>
                        <div className='msgbtn' onClick={loggedInUser.username === User.username ? null : handleFollow}>
                            <span> {(loggedInUser.username === User.username) ? "MESSAGES" : follow ? "UNFOLLOW" : 'FOLLOW'} </span>
                            {(loggedInUser.username === User.username) ? <Send /> : follow ? < PersonRemoveAlt1Icon /> : < PersonAddAlt1Icon />}
                        </div>
                    </div>
                </div>
            </div>
            <div className='profileOptions'>
                <div className='ullist'>
                    <hr />
                    <ul className='profileOptionsList'>

                    </ul>
                </div>
            </div>
            <div className="profileFeed">
                <div className='profileFeeddetails'>
                    <Information />
                    <PersonalInfo />
                    <FriendElement />
                </div>
                <div className='ProfileFeedFeed'>
                    <Content username={username} />
                </div>

            </div>
            <p>
                likith reddy
            </p>

        </div>
    )
}

export default Profile