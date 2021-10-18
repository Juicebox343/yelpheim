import React, {useContext, useEffect, useState, } from 'react';
import {publicFetch} from "../apis/fetch";
import {Link, useLocation, Redirect, useHistory} from 'react-router-dom';

import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
    const [newUser, setNewUser] = useState(false);
    const [username, setUsername] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [firstName, setFirstName] = useState(""); 
    const [email, setEmail] = useState(""); 
    const { registerUser, login, isLoggedIn } = useContext(AuthContext);

    const loginForm = () =>{
        return(
            <>
            <form className="userAccountForm">
                <p>Track your world’s rest stops, way stations, houses and inns</p>
                <label>
                    Username
                    <input type="text" id='username' name="username" value={username} onChange={e => setUsername(e.target.value)}/>
                </label>
                <label>
                    Password
                    <input type="password" id='password' name="password" value={password} onChange={e => setPassword(e.target.value)}/>
                </label>
                <div>
                    <button type='submit' className="actionButton" onClick={(e)=>login(e, username, password)}>Login</button>
                   
                </div>
            </form>
            
            </>
        )
    }

    const registerForm = () =>{
        return(
            <form className="userAccountForm">
                <label>
                    First Name
                    <input type="text" name="firstName" required value={firstName} onChange={e => setFirstName(e.target.value)}/>
                </label>
                <label>
                    Email
                    <input type="email" name="email" required value={email} onChange={e => setEmail(e.target.value)}/>
                </label>
                <label>
                    Username
                    <input type="text" name="username" required value={username} onChange={e => setUsername(e.target.value)}/>
                </label>
                <label>
                    Password
                    <input type="text" name="password" required value={password} onChange={e => setPassword(e.target.value)}/>
                </label>
                <button type='submit' className="actionButton" onClick={(e)=>registerUser(e, username, password, email, firstName)}>Register</button>
            </form>
        )
    }

    return (
        <main className='loginPage'>
            <Header/>
            <div className='container'>
                {isLoggedIn ? <Redirect to={'/'}/> : newUser ? registerForm() : loginForm()}
            </div>


            {newUser ? <button type='submit' className="actionButton" onClick={e => setNewUser(false)}>Go back to login</button> : <button to={`/register`} className='registerLink' onClick={e => setNewUser(true)}>No account? Register here</button>}
            
            
        </main>
    )
}

export default LoginPage
