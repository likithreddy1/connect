import { Avatar } from '@material-ui/core';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import './Rightbar.css'

function Rightbar() {
  const { user: LoggedInUser } = useContext(AuthContext)
  const [friends, setFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
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
  // console.log(friends)
  return (
    <div className='sidebar'>
      <div className="birthdaywrapper">
        <div className="birthdayTextWrapper">
          <img className='birthdayImg' src="assets/birthday.png" alt="" />
          <p>
            <b>
              Badrinath Reddy
            </b> and <b> 3 others </b> are celebrating birthday today
          </p>
        </div>
        <div className="onlineFriendsWrapper">
          <p>

            <b>
              Friends
            </b>
            <hr />
          </p>
          <ul>
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

          </ul>
        </div>
      </div>
    </div>
  )
}

export default Rightbar