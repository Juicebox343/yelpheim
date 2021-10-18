import React, {useContext, useEffect, useState, } from 'react';
import {publicFetch} from "../apis/fetch";
import {Link, useLocation, Redirect, useHistory} from 'react-router-dom';

import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
    const authContext = useContext(AuthContext)
    const [username, setUsername] = useState(""); 
    const [password, setPassword] = useState(""); 
    let history = useHistory();
    
    const loginHandler = async (e) =>{
        e.preventDefault();
        try {
            
            const response = await publicFetch.post('login', {
                username,
                password,
            });
            authContext.setAuthState(response.data.data.user_data)
            history.push(`/${username}`)
        } catch(err){
            console.log(err);
            history.push(`/`)
        }
    };
    return (
        <main className='loginPage'>
             <Header/>
            <div className='container'>
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
                        <button type='submit' className="actionButton" onClick={loginHandler}>Login</button>
                        <Link to={`/register`} className='registerLink'>Register</Link>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default LoginPage
