import { Comment, Delete, FavoriteBorderOutlined, MoreVert, Share } from '@material-ui/icons'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../../context/AuthContext'
import { format } from "timeago.js";
import { Link } from 'react-router-dom';
import './Feed.css'
import { Avatar } from '@material-ui/core';
function Feed({ post, setSave,setcommentPost}) {
    const [user, setUser] = useState({})
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [like, setLike] = useState(post.likes.length);
    const [isLiked, setIsLiked] = useState(false);
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [showcomment, setshowComment] = useState("")
    const [comment, setComment] = useState("")
    
    // console.log(post.userId)
    const handleClick = async () => {
        await axios.delete(`/feed/delete/${post._id}`, { data: { id: post.userId } });
        dispatch({ type: "DELETE", payload: user._id });
        window.location.reload()
    }
    useEffect(() => {
        setIsLiked(post.likes.includes(currentUser._id));
    }, [currentUser._id, post.likes]);


    useEffect(() => {
        const fetchUser = async () => {
            const user = await axios.get(`/users?userId=${post.userId}`);
            setUser(user.data)
        }
        fetchUser();
    }, [])

    const commentHandler = (e) => {
        e.preventDefault();
        try {
            const data = {
                userId: currentUser._id,
                comment: comment
            }
            console.log(data)
            axios.put("/feed/" + post._id + "/comment", {
                userId: currentUser,
                comment: comment
            });
        } catch (err) { }
        setcommentPost(true);
    }
    const likeHandler = () => {
        try {
            axios.put("/feed/" + post._id + "/like", { userId: currentUser._id });
        } catch (err) { }
        setLike(isLiked ? like - 1 : like + 1);

        setIsLiked(!isLiked);
    };
    const savehandler = () => {
        setSave(post);
    }
    const Commentlist = () => {
        return (
            post.comments.map(comment => {
                console.log(comment)
                return (
                    <li style={{ display: "flex", alignItems: 'flexend', padding: '10px' }}>
                        <Avatar src={comment.userId.profilepic} />
                        <p style={{ marginLeft: "10px", padding: '5px 10px', backgroundColor: "rgb(194, 188, 188)", width: "auto", borderRadius: "10px" }}>
                            <span style={{ fontWeight: 'bold' }}>
                                {comment.userId.username}
                            </span><br />
                            <span>
                                {comment.comment}
                            </span>
                        </p>
                    </li>
                )
            })
        )
    }
    return (
        <div className='root'>
            <div className='title'>
                <Link to={`/profile/${user.username}`} className='link2'>
                    <div>
                        <Avatar className='feedimg' src={user.profilepic ? `${PF}images/${user.profilepic}` : PF + "/images/noAvatar.png"} alt="" />
                        <p>
                            <span style={{ fontWeight: "bold", marginRight: '10px', textTransform: 'uppercase' }}>{user.username}</span>
                            <span className='time'>{format(post.createdAt)}</span>
                        </p>
                    </div>
                </Link>
                {
                    user._id === currentUser._id ? <Delete onClick={handleClick} style={{ paddingRight: '10px', cursor: 'pointer' }} /> : <MoreVert style={{ cursor: "pointer" }} onClick={savehandler} />
                }

            </div>

            <p style={{ paddingLeft: '20px' }}>
                {post?.desc}
            </p>
            <img className='postimage' src={post?.img ? `${PF}images/${post.img}` : null} alt="" />
            <hr style={{ margin: " 0 25px" }} />
            <div className='likecommentbuttons'>
                <div className='btn' onClick={likeHandler}>
                    <FavoriteBorderOutlined htmlColor={isLiked ? "tomato" : "grey"} />
                    <span>{like > 1 ? like + " likes" : like + " Like"}</span>
                </div>
                <div className='btn' onClick={() => { setshowComment(!showcomment) }}>
                    <Comment htmlColor='grey' />
                    <span>{post?.comments.length > 1 ? post?.comments.length + " comments" : post?.comments.length + " comment"}</span>
                </div>
            </div>

            {showcomment ? <ul>
                <hr style={{ margin: " 0 25px" }} />
                {
                    post.comments.length > 0 ? <Commentlist /> : null
                }
            </ul> : null}
            {showcomment ? <form className='form' onSubmit={commentHandler}>
                <div>
                    <Avatar src={currentUser.profilepic} alt="" />
                    <p style={{ position: "relative", top: "-10px", left: "27px", width: "10px", height: "10px", backgroundColor: "green", borderRadius: '50%', marginRight: '10px' }}></p>


                </div>

                <input required type="text" placeholder='Enter Comment' onChange={(e) => setComment(e.target.value)} />
                <button type='submit' classname="commentbtn">
                    SUBMIT
                </button>
            </form> : null}
        </div>

    )
}

export default Feed