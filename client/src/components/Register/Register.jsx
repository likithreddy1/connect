import React, { useRef, useState } from 'react'
import './register.css'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
function Login() {
    const emailRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const cityRef = useRef();
    const countryRef = useRef();
    const [relation,setRelation] = useState();
    const descRef = useRef();
    const relationRef = useRef();
    const navigate = useNavigate();
    console.log(relation)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwordRef.current.value !== confirmPasswordRef.current.value) {
            passwordRef.current.setCustomValidity("password doesn't match")
        }
        else {
            const User = {
                username: usernameRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value,
                city: cityRef.current.value,
                country: countryRef.current.value,
                relation: relationRef.current.value,
                desc: descRef.current.value,
            }
            try {
                await axios.post('auth/register', User);
                navigate("/login", { replace: true });
                console.log(User)
            }
            catch (err) {
                console.log(err)
            }
        }
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
            <form className='inputdiv' onSubmit={handleSubmit}>
                <p className='title'>CONNECT</p>
                <input type="text" placeholder='Full Name' required ref={usernameRef} />
                <input type="email" placeholder='Email' required ref={emailRef} />
                <input type="password" placeholder='Password' required ref={passwordRef} />
                <input type="password" placeholder='Confirm Password' required ref={confirmPasswordRef} />
                <input type="text" placeholder='Enter Your City Name' required ref={cityRef} />
                <select id="relation" ref={countryRef}>
                <option value="">Choose your country</option>
                    <option value="India">India</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                    <option value="Italy">Italy</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Spain">Spain</option>
                </select>
                <select id="relation" ref={relationRef}>
                <option value="">Choose your relation status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                </select>
                <input type="text" placeholder='Add Description' required ref={descRef} />
                <button className='signin'>SIGN UP</button>

                <Link to='/login'>

                    <button className='signup'> LOGIN</button>
                </Link>
            </form>
        </div>
    )
}

export default Login