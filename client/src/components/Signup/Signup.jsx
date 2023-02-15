import React from 'react';
import './Signup.css';
import { useState } from 'react';
import axios from "axios";

function Signup() {

  // const [userName, setUserName] = useState("");
  // const [password, setPassword] = useState("");
  // const [gender, setGender] = useState("");
  // const [age, setAge] = useState("");
  const [user, setUser] = useState({
    username: "",
    password: "",
    gender: "",
    age: ""
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post("http://localhost:3001/signup", { user })
      .then(data => {
        console.log(data);
      }).catch(err => console.error(err))
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    })
  }

  return (
    <main className='signup-page'>
      <form className="signup-form">
        <div className='form-input'>
          <label name="userName">Username</label>
          <input type="text" name="username" value={user.userName} onChange={handleChange} />
        </div>
        <div className='form-input'>
          <label name="password">Password</label>
          <input type="password" name="password" value={user.password} onChange={handleChange} />
        </div>
        <div className='form-input'>
          <label name="gender">Gender</label>
          <input value={user.gender} name="gender" onChange={handleChange}></input>
        </div>
        <div className='form-input'>
          <label name="age">Age</label>
          <input type="number" value={user.age} name="age" onChange={handleChange} />
        </div>
        <div>
          <button type='submit' className='submit-btn' onClick={handleSubmit}>SUBMIT</button>
        </div>
      </form>
    </main>
  )
}

export default Signup