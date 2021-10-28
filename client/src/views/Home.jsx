import React, { useContext, useEffect } from "react";
import { publicFetch } from "../apis/fetch";
import { WorldsContext } from "../context/WorldsContext";
import { AuthContext } from "../context/AuthContext";

import Panel from "../components/Panel";
import Search from "../components/Search";
import LocationList from "../components/LocationList";
import BiomeList from "../components/BiomeList";
import Header from "../components/Header";
import LocationThumbnail from "../components/LocationThumbnail";

const Home = (props) => {
  const {
    setAllWorlds,
    selectedWorld,
    setLocalStorage,
    setAllTags,
    removeLocalStorage,
    allLocations,
    setAllLocations,
    setMyLocations,
    setAllBiomes,
    setSelectedLocation,
    setSelectedLocationGallery
  } = useContext(WorldsContext);

  const { userData, isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    removeLocalStorage("selectedLocation");
    removeLocalStorage("searchResults");
    setSelectedLocation({});
    setSelectedLocationGallery([]);
  }, []);

  return (
    <>
      <Header />
      <main className="homePage">
        <Panel/>
        <section className="main-container">
          <Search />
          <div className="sub-container">
            <h2>Recently Added</h2>
            <ul className="locationList">
              {allLocations &&
                allLocations.map((location) => {
                  return <LocationThumbnail location={location} />;
                })}

              {/* {Object.entries(userData).length !== 0 && <li className='addLocationLink'><Link to={`/worlds/${selectedWorld.id}/locations/new`}>Add New Location</Link></li>} */}
            </ul>
          </div>

          <BiomeList />
        </section>
      </main>
    </>
  );
};

export default Home;
