import { Avatar } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
function List({ listitem, LoggedInUser, onlineFriends }) {
  const [user, setUser] = useState(null);
  const [friendId, setId] = useState("")
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  useEffect(() => {
    const friendId = listitem.members.find(member => member !== LoggedInUser._id);
    setId(friendId)
    const getuser = async () => {
      const res = await axios.get(`/users?userId=${friendId}`);
      setUser(res.data);
    }
    getuser();
  }, [listitem, LoggedInUser])
  let bool = onlineFriends.includes(friendId);
  // console.log(bool, friendId)
  return (
    <>
      {bool ? <div className='friend-list'>
        <div>
          <Avatar src={user?.profilepic ? `${PF}images/${user.profilepic}` : '/assets/images/noAvatar.png'} alt="" />
          <p>{user?.username}</p>
        </div>
        <p style={{width:"10px",height:"10px",backgroundColor:"green",borderRadius:'50%',marginRight:'10px'}}></p>
      </div> : <div className='friend-list'>
        <div>
          <Avatar src={user?.profilepic ? `${PF}images/${user.profilepic}` : '/assets/images/noAvatar.png'} alt="" />
          <p>{user?.username}</p>
        </div>
      </div>}

    </>
  )
}

export default List