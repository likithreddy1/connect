import React, { useContext, useEffect, useState } from 'react'
import './Content.css'
import Feed from './Feed/Feed'
import Post from './Post/Post'
import axios from 'axios'
import { AuthContext } from '../../../context/AuthContext'
function Content({ username }) {
  const [Posts, setPost] = useState([]);

  //fetch posts from backend with the help of useeffect hook
  const [save, setSave] = useState([]);
  const user = useContext(AuthContext).user;
  const [commentpost, setcommentPost] = useState(false)
  useEffect(() => {
    const fetchdata = async () => {
      const response = username ? await axios.get("/feed/profile/" + username) : await axios.get("/feed/timeline/" + user._id);
      setPost(response.data.sort((p1, p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt)
      }))
    }
    fetchdata();
  }, [username, commentpost])
  // console.log(Posts.length)
  // console.log(save)
  return (
    <div className='content'>
      {(!username || username === user.username) && <Post />}
      {
        Posts.length > 0 ?
          Posts.map(post => {
            return <Feed key={post._id} post={post} setcommentPost={setcommentPost} setSave={setSave} />
          }) : <div className='welcometext'>
            <span >
              WELCOME TO CONNECT
            </span>
            <p> Explore and connect with your friends</p>
          </div>
      }
    </div>
  )
}

export default Content