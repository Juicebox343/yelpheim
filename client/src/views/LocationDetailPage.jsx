import { useContext, useState, useEffect } from "react";
import { WorldsContext } from "../context/WorldsContext";
import { useHistory, useParams, Link } from "react-router-dom";
import { publicFetch } from "../apis/fetch";
import Header from "../components/Header";
import { AuthContext } from "../context/AuthContext";
import Panel from "../components/Panel";

const LocationDetailPage = () => {
  let history = useHistory();
  const { world_id, location_id } = useParams();
  const {
    worldData,
    setWorldData,
    selectedWorld,
    setSelectedWorld,
    selectedLocation,
    setSelectedLocation,
    setLocalStorage,
    locationData,
    setLocationData,
    addLocations,
    addWorlds,
    tagData,
    setTagData,
    myLocations,
    setMyLocations,
  } = useContext(WorldsContext);

  const { userData, logout } = useContext(AuthContext);

  const handleLocationDelete = async (e, id) => {
    try {
      const response = await publicFetch.delete(`/locations/${id}`);
      setMyLocations(
        myLocations.filter((location) => {
          return location.id !== id;
        })
      );
    } catch (err) {
      console.log(err);
    }
    history.goBack();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await publicFetch.get(`/locations/${location_id}`);
        console.log(response.data.data.selectedLocation[0])
        setSelectedLocation(response.data.data.selectedLocation[0]);
        setLocalStorage(
          "selectedLocation",
          response.data.data.selectedLocation[0]
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <main>
        <Panel />
        <section className="main-container">
          <Link to="/">&#8592;</Link>
          {Object.entries(selectedLocation).length !== 0 && (
            <div className="location-detail">
              <header>
                <h1>{selectedLocation.location_name}</h1>
                <img
                  src={selectedLocation.header_url}
                  alt={selectedLocation.location_name}
                  class="location-image"
                />
              </header>

              <p>
                Nestled in the
                {/* {selectedLocation.biomes !== null && 
                  selectedLocation.biomes.length > 1
                  ? selectedLocation.biomes.map((biome, index) => {
                      if (index === selectedLocation.biomes.length - 1) {
                        return " " + biome.biome_name + " biomes";
                      }
                      if (index !== selectedLocation.biomes.length - 2) {
                        return " " + biome.biome_name + ", ";
                      } else if (index !== selectedLocation.biomes.length - 1) {
                        return " " + biome.biome_name + " and ";
                      }
                    })
                  : selectedLocation.biomes.map((biome, index) => {
                      return " " + biome.biome_name + " biome";
                    })} */}
              </p>
              <p>{selectedLocation.location_description}</p>
              <p>
                Built by{" "}
                {selectedLocation.builder_username === ""
                  ? "Unlisted"
                  : selectedLocation.builder_username}
              </p>
              <p>Added by {selectedLocation.added_by}</p>
              <h3>Tags:</h3>

              <div>
                <Link to={`/locations/${selectedLocation.id}/edit`}>
                  Edit Location
                </Link>
                <button
                  className="warning-button"
                  onClick={(e) => handleLocationDelete(e, selectedLocation.id)}
                >
                  Delete Location
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  )
};

export default LocationDetailPage;
