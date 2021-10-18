import React, { useContext } from "react";
import { WorldsContext } from "../context/WorldsContext";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LocationList = () => {
  const {
    selectedWorld,
    locationIndex
  } = useContext(WorldsContext);

  const { userData, logout } = useContext(AuthContext);
  return (
    <div className="locationListContainer">
      <h2>Recently Added</h2>
      <ul className="locationList">
        {locationIndex.length > 0 &&
          locationIndex.map((location) => {
            return (
              <li
                key={location.id}
                className="hoverHands"
                style={{
                  backgroundImage: `url(${location.header_url})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              >
                <Link to={`/locations/${location.id}`}>
                  <h3>{`${location.location_name}`}</h3>
                </Link>
              </li>
            );
          })}
        {Object.entries(userData).length !== 0 && (
          <li className="addLocationLink">
            <Link to={`/worlds/${selectedWorld.id}/locations/new`}>
              Add New Location
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default LocationList;
