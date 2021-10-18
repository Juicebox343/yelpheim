import React, { useState, useEffect, createContext } from "react";
import {publicFetch} from "../apis/fetch";

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => { 
  
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')) || {});
  const [status, setStatus] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(Object.entries(userData).length !== 0  ? true : false);
  
  const login = async (e, username, password) =>{
    e.preventDefault();
    try {
      const dbResponse = await publicFetch.post('/login', {
          username,
          password
      }).then(results => {
        const returnedUser = results.data.data.userData
        setUserData(returnedUser)
        setStatus('')
        setLocalStorage(returnedUser)
        setIsLoggedIn(true)
      });
    } catch(err){
        setStatus(err)
    }
  }

  const logout = (e) =>{
    e.preventDefault();
    try {
        const request = publicFetch.get(`logout`);
    } catch(err){
        console.log(err);
    }
    setUserData({})
    setIsLoggedIn(false)
    localStorage.removeItem('userData');
    localStorage.removeItem('selectedWorld');
    localStorage.removeItem('selectedLocation');
  }

  const registerUser = async (e, username, password, email, firstName) =>{
    e.preventDefault();
    try {
      const dbResponse = await publicFetch.post(`register`, {
        first_name: firstName,
        username: username,
        user_pass: password,
        email: email
    }).then((response)=>{
        if(response.data.error){
          setStatus(response.data.message)
          return
        }
    })    
    } catch(err){
      setStatus(err)
  }
}

  const setLocalStorage = (userData) => {
    return localStorage.setItem('userData', JSON.stringify(userData))
  }

  return (
    <Provider
      value={{
       login,
       logout,
       registerUser,
       userData,
       isLoggedIn
        }}
      >
      {children}
    </Provider>
  );
};


export {AuthContext, AuthProvider};


















//   let userData = localStorage.getItem('userData') || {}

//   const [authState, setAuthState] = useState({
//     userData: userData.username ? JSON.parse(userData) : {}
//   });
  
//   const setAuthInfo = (userData) =>{
//     localStorage.setItem(
//       'userData', JSON.stringify(userData)
//     );
//     setAuthState({
//       userData: {'first_name': userData.first_name, 'username': userData.username, 'email': userData.email}
//     })
//   }

//   const isAuthenticated = () => {
//     if(!authState.username){
//       return false;
//     }
//   }

//   return (
//     <Provider
//       value={{
//         authState, 
//         setAuthState: authInfo => setAuthInfo(authInfo), 
//         isAuthenticated
//         }}
//       >
//       {children}
//     </Provider>
   
//   );
// };




// import React, { useState, createContext } from "react";

// const AuthContext = createContext();
// const { Provider } = AuthContext;

// const AuthProvider = ({ children }) => { 

//   const userData = localStorage.getItem('userData') || {}

//   const [authState, setAuthState] = useState({
//     userData: userData.username ? JSON.parse(userData) : {}
//   });

//   const setAuthInfo = (userData) =>{
//     localStorage.setItem(
//       'userData', JSON.stringify(userData)
//     );
//     setAuthState({
//       userData: {'first_name': userData.first_name, 'username': userData.username, 'email': userData.email}
//     })
//   }

//   const isAuthenticated = () => {
//     if(!authState.username){
//       return false;
//     }
//   }

//   return (
//     <Provider
//       value={{
//         authState, 
//         setAuthState: authInfo => setAuthInfo(authInfo), 
//         isAuthenticated
//         }}
//       >
//       {children}
//     </Provider>
   
//   );
// };

// export {AuthContext, AuthProvider};