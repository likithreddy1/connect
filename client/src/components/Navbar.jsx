import React, { useContext, useEffect, useState } from 'react'
import "./Navbar.css"
import { Link } from "react-router-dom"
import { Chat, Notifications, Person, Search, Home, HomeTwoTone, Storefront, StorefrontOutlined } from '@material-ui/icons';
import { Avatar, Badge } from '@material-ui/core'
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
function Navbar() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const loggedUser = useContext(AuthContext).user;
    const dispatch = useContext(AuthContext).dispatch;
    const [users, setUsers] = useState([])
    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState("");
    const [profile,setprofile]=useState(false);
    const handleFilter = (event) => {
        const searchWord = event.target.value;
        setWordEntered(searchWord);
        const newFilter = users.filter((value) => {
            return value.username.toLowerCase().includes(searchWord.toLowerCase());
        });
        if (searchWord === "") {
            setFilteredData([]);
        } else {
            setFilteredData(newFilter);
        }
    };

    const clearInput = () => {
        setFilteredData([]);
        setWordEntered("");
    };
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await axios.get('/users/allusers');
            setUsers(res.data)
        }
        fetchUsers()
    }, [])
    const handleClick = () => {
        const logoutCall = () => {
            dispatch({ type: "LOG_OUT" })
        }
        logoutCall();
        window.location.reload()
    }
   const handleporfile =()=>{
       setprofile(true)
   }
    return (
        <>
        <div className='navbar'>
            <div className='navbarLeft'>
            <Link to='/' className='link1'>
                <span className="logo" style={{ cursor: "pointer" }}>CONNECT</span></Link>
            </div>
            <div className='navbarMiddle'>
                <div className="searchBar">
                    <input placeholder='Search for friend,post or video' className='searchInput'   onChange={handleFilter}/>
                    <Search style={{ color: "#D8DADD", cursor: "pointer", padding: '1vh' }} />
                   
                </div>
              
            </div>
            <div className='navbarRight'>
                <Link style={{backgroundColor:'none'}} to="../" className='link1'>
                    <Home className='icons' />
                </Link>
                {/* <StorefrontOutlined className='icons'/> */}

                <Link to={`/profile/${loggedUser.username}`}  className='link1'>
                    <div className="nabvarIcons">
                        <Badge anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }} badgeContent={0} max={10} color="primary">
                            <Person className='icons'   onClick={handleporfile}/>
                        </Badge>
                    </div>
                </Link>
                <Link to='/chat'  className='link1'>
                    <div className="nabvarIcons">
                        <Badge anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }} badgeContent={0} max={10} color="primary">
                            <Chat className='icons'   onClick={handleporfile}/>
                        </Badge>
                    </div>
                </Link>
                <Link to={profile?'../../':'/'}  className='link1'>
                    <Avatar onClick={handleClick} className='img' src={loggedUser.profilepic ? loggedUser.profilepic : PF + "images/noAvatar.png"} alt='Likith' />
                </Link>
            </div>
        </div>
            {filteredData.length != 0 && (
                    <div className="dataResult">
                        {filteredData.map((value, key) => {
                           let username=value.username                            
                           return (
                                <Link to={`/profile/${username}`}>
                                <div className="dataItem" href={value.link} target="_blank" >
                                    <p>{value.username} </p>
                                </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
        
        </>
    )
}

export default Navbar