import React, { useState } from 'react';
import './Login.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Login() {

    const navigate = useNavigate();
    const [userLogin, setUserLogin] = useState({
        email: "",
        password: "",
    })
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        if (!userLogin.email || !userLogin.password) {
            alert("Invalid Inputs");
            return;
        }
        axios.post("http://localhost:3001/login", { userLogin }).then((data) => {
            localStorage.setItem("isLoginAuth", true);
            localStorage.setItem("userData", JSON.stringify(data))
            navigate("/home", { state: data.data.userDeets });
            window.location.reload(false);
            console.log(data);
        }).catch(err => {
            console.log(err);
            // navigate("/error");
        })
    }
    // Handling Inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserLogin({
            ...userLogin,
            [name]: value
        })
    }

    return (
        <>
            <main className='login-page'>
                <form className='login-form'>
                    <h1>LOGIN</h1>
                    <div className='form-input'>
                        <label name="email">Email</label>
                        <input type="email" name="email" value={userLogin.email} onChange={handleInputChange} placeholder="Enter your email" required />
                    </div>
                    <div className='form-input'>
                        <label name="password">Password</label>
                        <input type="password" name="password" value={userLogin.password} onChange={handleInputChange} placeholder="Enter your password" required />
                    </div>
                    <div className='form-btn'>
                        <button type='submit' className='submit-btn' onClick={(e) => {
                            handleLoginSubmit(e);
                        }}>LOGIN</button>
                        <p>OR</p>
                        <button type='submit' className='submit-btn' onClick={(e) => {
                            e.preventDefault();
                            localStorage.removeItem("isSignupAuth");
                            navigate("/signup");
                            window.location.reload(false);
                        }}>SIGNUP</button>
                    </div>
                    {/* <button className='spotify-btn'>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/991px-Spotify_icon.svg.png" alt="spotify" width={"20px"} />
                        <a href={AUTH_URL}>SPOTIFY</a>
                    </button> */}
                </form>
            </main>
        </>
    )
}

export default Login