import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {publicFetch} from "../apis/fetch";

const RegistrationPage = () => {
    let history = useHistory();
    const [firstName, setFirstName] = useState(""); 
    const [email, setEmail] = useState(""); 
    const [username, setUsername] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [signUpStatus, setSignUpStatus] = useState();
    const [inviteCode, setInviteCode] = useState();

    const submitHandler = async (e) =>{
        e.preventDefault();
            await publicFetch.post(`register`, {
                first_name: firstName,
                username: username,
                user_pass: password,
                email: email
            }).then((response)=>{
                if(response.data.error){
                    setSignUpStatus(response.data.message)
                } else {
                    setSignUpStatus(response.data.message)
                    history.push("/")
                }

            })
    }           

    return (
        <div>
            <p>{signUpStatus}</p>
            <form>
                <label>
                Invite Code
                <input type="text" name="inviteCode" required value={inviteCode} onChange={e => setInviteCode(e.target.value)}/>
                </label>
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
                <button type='submit' onClick={submitHandler}>Register</button>
            </form>
        </div>
    )
}

export default RegistrationPage
