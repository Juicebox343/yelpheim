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
    setAllTags,
    removeLocalStorage,
    allLocations,
    setAllLocations,
    setMyLocations,
    setAllBiomes,
    setSelectedLocation,
  } = useContext(WorldsContext);

  const { userData, isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {

      try {
        const response = await publicFetch.get("/");
        setAllLocations(response.data.data.allLocations);
        setAllWorlds(response.data.data.myWorlds);
        setAllTags(response.data.data.tags);
        setAllBiomes(response.data.data.biomes);
        setMyLocations(response.data.data.myLocations);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [isLoggedIn]);
  

  useEffect(() => {
    removeLocalStorage("selectedLocation");
    removeLocalStorage("searchResults");
    setSelectedLocation({});
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
