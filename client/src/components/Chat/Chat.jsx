import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import Navbar from '../Navbar'
import List from './chatlist/List'
import './chat.css'
import Message from './message/Message'
import axios from 'axios'
import {io} from 'socket.io-client'
import { Link } from 'react-router-dom'
import { Avatar } from '@material-ui/core'

function Chat() {
  const { user: LoggedInUser } = useContext(AuthContext)
  const [chatlist, setList] = useState([])
  const [conversation, setConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newmessage,setnewMessage]=useState("");
  const [ arrivalMessage,setArrivalMessage]=useState(null)
  const [Friends,setFriends]=useState([])
  const [list,setlists]=useState(false)
  const [onlineFriends,setOnlineFriends]=useState([])
  const [user, setUser] = useState(null);
  const [search,setSearch]=useState();
// console.log(Friends)
  // console.log(onlineFriends)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const socket=useRef();
  const scrollRef= useRef();
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
    // console.log(LoggedInUser);

  useEffect(() => {
 socket.current=io("https://connect-chat-server.herokuapp.com/");
 socket.current.on("getMessage", (data) => {
  setArrivalMessage({
    sender: data.senderId,
    text: data.text,
    createdAt: Date.now(),
  });
});
},[])

const handleFilter = (event) => {
  const searchWord = event.target.value;
  setWordEntered(searchWord);
  const newFilter = Friends.filter((value) => {
      return value.username.toLowerCase().includes(searchWord.toLowerCase());
  });
  if (searchWord === "") {
      setFilteredData([]);
  } else {
      setFilteredData(newFilter);
  }
};
useEffect(() => {
  arrivalMessage &&
    conversation?.members.includes(arrivalMessage.sender) &&
    setMessages((prev) => [...prev, arrivalMessage]);
}, [arrivalMessage, conversation]);

useEffect(() => {
  socket.current.emit("addUser", LoggedInUser._id);
  socket.current.on("getUsers", (users) => {
    // console.log(users)
    setOnlineFriends(
      LoggedInUser.following.filter((f) => users.some((u) => u.userId === f))
    );
  });
}, [LoggedInUser]);

  useEffect(() => {
    const fetchChatlist = async () => {
      try {
        const list = await axios.get(`/conversation/${LoggedInUser._id}`);
        setList(list.data);
      } catch (error) {
        console.log(error)
      }
    }
    fetchChatlist();
  }, [LoggedInUser])
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/messages/${conversation?._id}`)
        setMessages(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchMessages();
  }, [conversation])
  // console.log(conversation)

  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior:"smooth"})
  })

  const handleClick =async()=>{
    const message={
      sender:LoggedInUser._id,
      text:newmessage,
      id:conversation._id
    }
    const receiverId = conversation.members.find(
      (member) => member !== LoggedInUser._id
    );

    socket.current.emit("sendMessage", {
      senderId: LoggedInUser._id,
      receiverId,
      text: newmessage,
    });

    try {
         const res= await axios.post('/messages',message);
          setMessages([...messages,res.data]);
          setnewMessage("")

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    const getFriends= async ()=>{
      const res = await axios.get('/users/friends/'+LoggedInUser._id)
      // console.log(res.data)
      setFriends(res.data)
    }
    getFriends();
  },[LoggedInUser])
  useEffect(() => {
    const friendId = conversation?.members.find(member => member !== LoggedInUser._id);
    // setId(friendId)
    const getuser = async () => {
      const res = await axios.get(`/users?userId=${friendId}`);
      console.log(res.data)
      setUser(res.data);
    }
    getuser();
  }, [conversation, LoggedInUser])
  // console.log(user)
  console.log(list)
  const handleSearch=(e)=>{
    setSearch(e.target.value)
    Friends.map(friend=>{
     setlists(friend.username===search)
      console.log(friend.username,search)
    })
  }
  return (
    <>
      <Navbar />
      <div className='ChatUI'>
        <div className='searchComponent'>
          <div className="searchwrap">
            <div>
            <input className='searchinput' type="text" placeholder='search friends' onChange={handleFilter}/>
            <button onClick={handleSearch}>Search</button>
            </div>
            {
              list?<ul style={{listStyle:'none'}}>
               {Friends.length != 0 && (
                    <div className="dataResult">
                        {Friends.map((friend) => {
                           let username=friend.username                            
                           return (
                                <Link to={`/profile/${username}`}>
                                <div className="dataItem" target="_blank" >
                                    <p>{username} </p>
                                </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </ul>:null}
            {
              chatlist.map(listitem => {
                return (
                  <div onClick={() => setConvo(listitem)}>
                    <List key={listitem._id} listitem={listitem} LoggedInUser={LoggedInUser} onlineFriends={onlineFriends} />
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className='textComponent'>
          {
            conversation ? <>
              <div className="header">
                <Link to='/' className='link'>
                <Avatar
                  className="headerimg"
                  src={user?.profilepic ? PF + "images/" + user?.profilepic : PF + "images/noAvatar.png"}
                  alt=""
                />
                <p>{user?.username}</p>
                </Link>
              </div>
              <div className="textwrap">
                {
                  messages.map(message => {
                    return <div ref={scrollRef}><Message key={message._id} own={message.sender===LoggedInUser._id?true:false} message={message} conversation={conversation} user={LoggedInUser} userFriend={user}/></div> 
                  })
                }
              </div>
              <hr />
              <div className='messagebox'>
                <textarea name="" id="" cols={120} rows={5} onChange={(e)=>setnewMessage(e.target.value)} placeholder='write you message here' value={newmessage}>
                </textarea>
                <button onClick={handleClick}>Send</button>
              </div>
            </> : <span>
             Select a friend to open chat
            </span>

          }
        </div>

      </div>
    </>
  )
}

export default Chat