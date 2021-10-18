import React, { useContext, useState, useEffect } from "react";
import { WorldsContext } from "../context/WorldsContext";
import { useHistory, useParams, Link } from "react-router-dom";
import { publicFetch } from "../apis/fetch";
import Header from "../components/Header";
import Panel from "../components/Panel";

import { imagePreview } from "../scripts";

const LocationEditPage = (e) => {
  const { world_id, location_id } = useParams();
  let history = useHistory();
  const {
    selectedLocation,
    setSelectedLocation,
    locationData,
    setLocationData,
    worldData,
    residentData,
  } = useContext(WorldsContext);

  const [locationName, setLocationName] = useState("");
  const [builder, setBuilder] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [imageUpload, setImageUpload] = useState(null);

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
    setLocationName(selectedLocation.location_name);
    setLocationDescription(selectedLocation.location_description);
  }, []);

  useEffect(() => {
    selectedLocation.biomes.forEach((biome) => {
      let biomeID = parseInt(biome.id) - 1;
      const updatedCheckedState = checkedState.map((item, index) => {
        if (index === biomeID) {
          return !item;
        } else {
          return item;
        }
      });
      setCheckedState(updatedCheckedState);
    });
  }, []);

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

  const updateLocationHandler = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("location_name", locationName);
    formData.append("location_description", locationDescription);
    formData.append("biomes", handleCheckBoxBiomes());
    formData.append("builder_username", builder);
    formData.append("image_upload", imageUpload);

    const config = {
      headers: { "content-type": "multipart/form-data" },
    };

    const updatedLocation = await publicFetch.put(
      `/locations/${location_id}`,
      formData,
      config
    );
    console.log(updatedLocation);
    history.push(`/locations/${location_id}`);
  };

  return (
    <>
      <Header />
      <main>
        <Panel />
        <section className="main-container">
          <Link to={`/locations/${location_id}`}>&#8592;</Link>
          {Object.entries(selectedLocation).length !== 0 && (
            <div>
              <h1>Editing {selectedLocation.location_name}</h1>
              <form encType="multipart/form-data">
                <label>
                  <input
                    type="file"
                    name="location-image"
                    onChange={(e) => setImageUpload(e.target.files[0])}
                  ></input>
                  <img
                    id="image-preview"
                    src={
                      imageUpload !== null && URL.createObjectURL(imageUpload)
                    }
                  />
                </label>
                <label>
                  Location Name
                  <input
                    type="text"
                    name="location-name"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
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
                  Built by:
                  <select
                    className="form-select"
                    value={builder}
                    onChange={(e) => setBuilder(e.target.value)}
                  >
                    <option key={0} value="null">
                      Unlisted
                    </option>
                    {residentData &&
                      residentData.map((resident) => {
                        return (
                          <option
                            key={resident.username}
                            value={resident.username}
                          >
                            {resident.first_name}
                          </option>
                        );
                      })}
                  </select>
                </label>
                <button type="submit" onClick={updateLocationHandler}>
                  Update Location
                </button>
              </form>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default LocationEditPage;
