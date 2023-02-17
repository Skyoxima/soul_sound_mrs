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
            navigate("/homepage", { state: data.data.userDeets });
        }).catch(err => {
            console.log(err);
            navigate("/error");
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
                        }}>SUBMIT</button>
                        <p>OR</p>
                        <button type='submit' className='submit-btn' onClick={(e) => {
                            navigate("/signup");
                        }}>SIGNUP</button>
                    </div>
                </form>
            </main>
        </>
    )
}

export default Login