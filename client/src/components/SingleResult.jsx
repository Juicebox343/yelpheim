import React, {useContext} from 'react'
import { Link } from "react-router-dom";


const SingleResult = (props) => {
  console.log(props)
  return (
    <li
      key={props.result.id}
      className="hoverHands"
    >
      <Link to={`/locations/${props.result.id}`}>
        <h3>{`${props.result.location_name}`}</h3>
        <img src={props.result.header_url}/>
      </Link>
    </li>
  )
}

export default SingleResult
