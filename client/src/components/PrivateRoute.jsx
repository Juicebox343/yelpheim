// import React, {useContext} from "react";
// import { Redirect, Route, useLocation } from "react-router-dom";
// import { AuthContext } from '../context/AuthContext';

// const PrivateRoute = ({ component: Component, ...rest }) => {
//   const location = useLocation();
//   const authContext = useContext(AuthContext)

//   return (
//     <Route {...rest}>
//       {authContext.userName !== false ?
//         <Component />
//       :
//         <Redirect to={{ pathname: "/", state: { from: location } }} />
//       }
//     </Route>
//   );
// };

// export default PrivateRoute;
