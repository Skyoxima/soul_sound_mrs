import React from 'react';
import './Signup.css';
import { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Signup() {

  const navigate = useNavigate();

  // Storing userDeets
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    age: ""
  })

  // Handling Submit
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!user.username || !user.email || !user.password || !user.gender || !user.age) {
      return alert("Invalid Inputs");;
    }
    else if (user.password.length < 5) {
      return alert("Password should be have atleast five characters");
    }
    else {
      await axios.post("http://localhost:3001/signup", { user })
        .then(() => {
          navigate("/login");
        }).catch(err => {
          alert(err.response.data.message);
        })
    }
  }

  // Handling Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    })
  }

  return (
    <main className='signup-page'>
      <form className="signup-form">
        <h1>SIGN-UP</h1>
        <div className='form-input'>
          <label name="userName">Username</label>
          <input type="text" name="username" value={user.username} onChange={handleInputChange} placeholder="Enter your username" required />
        </div>
        <div className='form-input'>
          <label name="email">Email</label>
          <input type="email" name="email" value={user.email} onChange={handleInputChange} placeholder="Enter your email" required />
        </div>
        <div className='form-input'>
          <label name="password">Password</label>
          <input type="password" name="password" value={user.password} onChange={handleInputChange} placeholder="Enter your password" required />
        </div>
        <div className='form-input'>
          <label name="gender">Gender</label>
          <input type="radio" name="gender" value="male" onChange={handleInputChange} />
          <label>Male</label>
          <input type="radio" name="gender" value="female" onChange={handleInputChange} />
          <label>Female</label>
        </div>

        <div className='form-input'>
          <label name="age">Age</label>
          <input type="number" value={user.age} name="age" onChange={handleInputChange} placeholder="Enter your age" />
        </div>
        <div className='form-btn'>
          <button type='submit' className='submit-btn' onClick={(e) => {
            handleSignUpSubmit(e);
          }}>SIGNUP</button>
          <p>OR</p>
          <button type='submit' className='submit-btn' onClick={(e) => {
            navigate("/login");
          }}>LOGIN</button>
        </div>
      </form>
    </main>
  )
}

export default Signup