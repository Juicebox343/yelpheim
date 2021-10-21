import React, {useContext} from 'react'
import { Link } from "react-router-dom";


const SingleResult = (props) => {
  console.log(props)
  return (
    <li
      key={props.result.id}
      className="hoverHands"
    >
      <Link to={`/locations/${props.result.lid}`}>
        <h3>{`${props.result.location_name}`}</h3>
        <img src={props.result.location_header_url}/>
        <p className='description'>{props.result.location_description}</p>
        <ul className='dangers'>
          <li>Danger</li>
        </ul>
        <ul className='tags'>
          <li>Tag</li>
        </ul>
      </Link>
    </li>
  )
}

export default SingleResult
