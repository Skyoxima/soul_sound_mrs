import React from 'react'
import './Login.css';


function Login() {
    return (
        <>
            <main className='login-page'>
                <form action="/login" className='login-form' method='POST'>
                    <div className='form-input'>
                        <label name="userName">Username</label>
                        <input type="text" />
                    </div>
                    <div className='form-input'>
                        <label name="password">Password</label>
                        <input type="password" />
                    </div>
                    <div>
                        <input type="submit" value={"SUBMIT"} className='submit-btn' />
                    </div>
                </form>
            </main>
        </>
    )
}

export default Login