import {PhotoLibraryOutlined, SentimentVerySatisfiedOutlined, Videocam } from '@material-ui/icons'
import React, { useContext, useRef, useState } from 'react'
import './post.css'
import axios from 'axios'
import {AuthContext} from '../../../../context/AuthContext'
import { Avatar } from '@material-ui/core'
function Post() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const {user:currentUser}=useContext(AuthContext)
    const [file, setFile] = useState(null);
    const descRef=useRef()

    // console.log(currentUser)
    const handleSubmit=async (e)=>{
        e.preventDefault();
        const newpost={
            userId:currentUser._id,
            desc:descRef.current.value
        }
        if (file) {
            const data = new FormData();
            const fileName = Date.now() + file.name;
            data.append("name", fileName);
            data.append("file", file);
            newpost.cover = fileName;
            console.log(newpost);
            try {
              await axios.post("/upload", data);
            } catch (err) {
                console.log(err)
            }
          }
          try {
            await axios.post("/feed", newpost);
            window.location.reload();
          } catch (err) {}
        };
    return (
        <div className='post'>
            <div className='textfield'>
                <Avatar className='imgpost' src={currentUser.profilepic?`${currentUser.profilepic}`:PF+"/images/noAvatar.png"} alt="" />
                <input required type="text" ref={descRef} placeholder={`What's on your mind, ${currentUser.username}?`}/>
            </div>
            <hr style={
                {
                    margin:'2vh'
                }
            } />
            <form className='features' onSubmit={handleSubmit}>
                <div>
                    <Videocam htmlColor='green'/>
                    <span>Live video</span>
                </div>
                <label htmlFor='file'>
                    <PhotoLibraryOutlined htmlColor='tomato' />
                    <span>Photo/Video</span>
                </label>
                    <input style={{display:'none'}} type="file" id='file' accept='.png,.jpeg,.jpg,.webp' />
                <div>
                    <SentimentVerySatisfiedOutlined htmlColor='gold'/>
                    <span>Feelings</span>
                </div>
                <button type='submit' className='sharebtn'>Share</button>

            </form>
        </div>
    )
}

export default Post