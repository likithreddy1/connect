import React, { useContext, useRef } from 'react'
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Link} from 'react-router-dom'

import './Login.css'
function Login() {
    const emailRef = useRef();
    const passwordRef = useRef()
    const { user,isFetching, dispatch } = useContext(AuthContext);
    const handleClick = (e) => {
        e.preventDefault();
        loginCall({email:emailRef.current.value,password:passwordRef.current.value},dispatch)
        console.log(user)
    }
    return (
        <div className='loginroot'>
            <div className='logdiscription' style={{ flex: '2' }}>
                <div>

                    <p className='p1'>
                        CONNECT
                    </p>
                    <p className='p2' sty>
                        Connect helps you connect  <br />
                        and share with the
                        people <br /> in your life.
                    </p>
                </div>
            </div>
            <form className='inputdiv' onSubmit={handleClick}>
                <p className='title'>CONNECT</p>
                <input type="email" placeholder='Email or Phone Number' required ref={emailRef}/>
                <input type="password" placeholder='Password' minLength="6" required ref={passwordRef}/><br />
                <button className='signin'>{isFetching?<CircularProgress color='white' size="25px"/>:"SIGN IN"}</button>
                <p className='forgotpw'>
                    Forgot Password?
                </p>

                <hr className='' />

            <Link to='/register'>
                <button className='signup'>CREATE NEW ACCOUNT</button>
            </Link>
            </form>
        </div>
    )
}

export default Login