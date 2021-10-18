import { Link } from "react-router-dom";

const LocationThumbnail = (location) => {
  return (
    <li
      key={location.location.id}
      className="hoverHands"
      style={{
        backgroundImage: `url(${location.location.header_url})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <Link to={`/locations/${location.location.id}`}>
        <h3>{`${location.location.location_name}`}</h3>
      </Link>
    </li>
  );
};

export default LocationThumbnail;
