import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { WorldsContext } from "../context/WorldsContext";
import { publicFetch } from "../apis/fetch";
import Header from "../components/Header";
import { AuthContext } from "../context/AuthContext";
import Panel from "../components/Panel";
import Search from "../components/Search";

const LocationAddPage = () => {
  const [addedLocationName, setAddedLocationName] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [builder, setBuilder] = useState("");
  const [biome, setBiome] = useState(null);
  const [world, setWorld] = useState(null);
  const {
    selectedWorld,
    addLocations,
    residentData,
    setLocationIndex,
    setWorldData,
    setTagData,
  } = useContext(WorldsContext);
  const { username, world_id } = useParams();
  const { userData, logout } = useContext(AuthContext);
  const [imageUpload, setImageUpload] = useState(null);
  let history = useHistory();
  // const [builderUser, setbuilderUser] = useState("Resident");

  const biomes = [
    { name: "Meadow", value: 1 },
    { name: "Black Forest", value: 2 },
    { name: "Swamp", value: 3 },
    { name: "Mountain", value: 4 },
    { name: "Plains", value: 5 },
    { name: "Mistlands", value: 6 },
    { name: "Ashlands", value: 7 },
    { name: "Deep North", value: 8 },
    { name: "Ocean", value: 9 },
  ];

  const [checkedState, setCheckedState] = useState(
    new Array(biomes.length).fill(false)
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await publicFetch.get("/");
        setLocationIndex(response.data.data.locations);
        setWorldData(response.data.data.world_data);
        setTagData(response.data.data.tags);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const addLocationHandler = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("location_name", addedLocationName);
    formData.append("location_description", locationDescription);
    formData.append("biomes", handleCheckBoxBiomes());
    formData.append("builder_username", builder);
    formData.append("image_upload", imageUpload);

    const config = {
      headers: { "content-type": "multipart/form-data" },
    };

    try {
      const updatedLocation = await publicFetch.post(
        `/locations/`,
        formData,
        config
      );
      addLocations(updatedLocation.data.data.location_id);
      history.push(`/locations/${updatedLocation.data.data.location_id}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  const handleCheckBoxBiomes = () => {
    let tagsToSend = new Array();
    checkedState.map((checkbox, index) => {
      if (checkbox === true) {
        tagsToSend.push(biomes[index].value);
      }
    });
    console.log("tags to send " + typeof tagsToSend);
    return tagsToSend;
  };

  return (
    <>
      <Header />
      <main>
        <Panel />
        <section className="main-container">
          <Search />
          <form enctype="multipart/form-data">
            <h2>Add New Location to {selectedWorld.world_name}</h2>
            <label>
              <input
                type="file"
                name="location-image"
                onChange={(e) => setImageUpload(e.target.files[0])}
              ></input>
              <img
                id="image-preview"
                src={imageUpload !== null && URL.createObjectURL(imageUpload)}
              />
            </label>
            <label>
              Location Name
              <input
                type="text"
                name="location-name"
                value={addedLocationName}
                onChange={(e) => setAddedLocationName(e.target.value)}
              />
            </label>
            <label>
              Location Description
              <textarea
                value={locationDescription}
                onChange={(e) => setLocationDescription(e.target.value)}
              ></textarea>
            </label>

            <h3>Biome:</h3>
            <ul>
              {biomes &&
                biomes.map(({ name, value }, index) => {
                  return (
                    <li key={index}>
                      <label>
                        <input
                          type="checkbox"
                          name="biome"
                          checked={checkedState[index]}
                          onChange={() => handleOnChange(index)}
                          value={value}
                        />
                        <div>{name}</div>
                      </label>
                    </li>
                  );
                })}
            </ul>

            <label>
              <h3>Built by:</h3>
              <select
                className="form-select"
                value={builder}
                onChange={(e) => setBuilder(e.target.value)}
              >
                <option disabled>Resident</option>
                <option key={0} value="null">
                  Unlisted
                </option>
                {residentData &&
                  residentData.map((resident) => {
                    return (
                      <option key={resident.username} value={resident.username}>
                        {resident.first_name}
                      </option>
                    );
                  })}
              </select>
            </label>

            <label>
              <h3>World:</h3>
              <select
                className="form-select"
                value={world}
                onChange={(e) => setWorld(e.target.value)}
              >
                <option disabled>Resident</option>
                <option key={0} value="null">
                  Unlisted
                </option>
                {residentData &&
                  residentData.map((resident) => {
                    return (
                      <option key={resident.username} value={resident.username}>
                        {resident.first_name}
                      </option>
                    );
                  })}
              </select>
            </label>
            <button type="submit" onClick={addLocationHandler}>
              Add Location
            </button>
          </form>
        </section>
      </main>
    </>
  );
};

export default LocationAddPage;
