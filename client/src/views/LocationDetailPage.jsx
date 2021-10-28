import { useContext, useState, useEffect } from "react";
import { WorldsContext } from "../context/WorldsContext";
import { useHistory, useParams, Link } from "react-router-dom";
import { publicFetch } from "../apis/fetch";
import Header from "../components/Header";
import { AuthContext } from "../context/AuthContext";
import Panel from "../components/Panel";
import noImage from "../images/no_image.png";

const LocationDetailPage = () => {
  let history = useHistory();
  const { world_id, location_id } = useParams();
  const {
    selectedLocation,
    setSelectedLocation,
    selectedLocationGallery,
    setSelectedLocationGallery,
    setLocalStorage,
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

        setSelectedLocation(response.data.data.selectedLocation[0]);
        setLocalStorage(
          "selectedLocation",
          response.data.data.selectedLocation[0]
        );
        setSelectedLocationGallery(response.data.data.locationImages);
        setLocalStorage(
          "selectedLocationGallery",
          response.data.data.locationImages
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
          {selectedLocation && 
            <div className="location-detail">
              <header>
                <h1>{selectedLocation.location_name}</h1>

                {selectedLocationGallery.length ===
                0 ?
                  <img src={noImage} class="location-image" alt={selectedLocation.location_name}/>
                :
                  <img
                    src={
                      selectedLocationGallery.length > 0 &&
                      selectedLocationGallery.find(({is_main}) => is_main === true).url
                    }
                    alt={selectedLocation.location_name}
                    class="location-image"
                  />
                }

                <div className="gallery">
                  {selectedLocationGallery.length > 1 &&
                    selectedLocationGallery.map((image) => {
                      return <img src={image.url} alt={image.id}/>;
                    })}
                </div>
              </header>

              <p>
                Nestled in the
                {selectedLocation.biomes && selectedLocation.biomes !== undefined &&selectedLocation.biomes.length === 1 && 
                  selectedLocation.biomes.map((biome, index) => {
                      return " " + biome + " biome";
                 })}
                {selectedLocation.biomes && selectedLocation.biomes !== undefined &&selectedLocation.biomes.length > 1 && 
                  selectedLocation.biomes.map((biome, index) => {
                      if (index === selectedLocation.biomes.length - 1) {
                        return " " + biome + " biomes";
                      }
                      if (index !== selectedLocation.biomes.length - 2) {
                        return " " + biome + ", ";
                      } else if (index !== selectedLocation.biomes.length - 1) {
                        return " " + biome + " and ";
                      }
                      return 'No biomes assigned'
                    })}
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
          }
        </section>
      </main>
    </>
  );
};

export default LocationDetailPage;
