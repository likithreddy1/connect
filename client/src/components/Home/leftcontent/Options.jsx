import './Options.css'
import React, { useContext } from 'react'
import { Bookmark, Bookmarks, Chat, Event, Help, People, QueryBuilder, StorefrontOutlined, WbSunny } from '@material-ui/icons'
import { AuthContext } from "../../../context/AuthContext"
import { Link } from 'react-router-dom'
import { Avatar } from '@material-ui/core'
function Feed({ friends }) {
    const { user: loggedInUser } = useContext(AuthContext)
    // console.log(loggedInUser)
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const dispatch = useContext(AuthContext).dispatch;
    const handleClick = () => {
        const logoutCall = () => {
            dispatch({ type: "LOG_OUT" })
        }
        logoutCall();
        window.location.reload()
    }
    return (
        <div className='feed'>
            <div className="sidebar">
                <ul className="sidebarList">
                    <Link to={`/profile/${loggedInUser.username}`}>
                        <li className="listitems">
                            <Avatar className='img' src={loggedInUser.profilepic ? PF + "images/" + loggedInUser.profilepic : PF + "images/noAvatar.png"} />
                            <p style={{color:'black'}}>
                                {loggedInUser.username}
                            </p>
                        </li>
                    </Link>
                    <Link to='/chat'>
                        <li className="listitems" style={{ marginLeft: '15px' }}>
                            <Chat className='icon' />
                            <p>
                                Chat
                            </p>
                        </li>
                    </Link>
                    <Link to='/chat'>
                        <li className="listitems">
                            <button className='btn' style={{ backgroundColor: '#273239', color: 'white' }} onClick={handleClick}>
                                LOGOUT
                            </button>
                        </li>
                    </Link>
                </ul>
                <h2 style={{marginLeft:'20px'}}>FRIENDS</h2>
                <div className='flist'>
                {
                    friends.map(friend => {
                        return (
                            <li className="rightbarFriend">
                                <div className="rightbarProfileImgContainer">
                                    <Avatar className="rightbarProfileImg" src={friend.profilepic ? `${PF}images/${friend.profilepic}` : PF + "images/noAvatar.png"} alt="" />
                                </div>
                                <span className="rightbarUsername">{friend.username}</span>
                            </li>
                        )
                    })
                }
                </div>

            </div>
        </div>
    )
}

export default Feed