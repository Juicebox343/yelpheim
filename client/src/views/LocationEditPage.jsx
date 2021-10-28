import React, { useContext, useState, useEffect } from "react";
import { WorldsContext } from "../context/WorldsContext";
import { AuthContext } from "../context/AuthContext";
import { useHistory, useParams, Link } from "react-router-dom";
import { publicFetch } from "../apis/fetch";
import Header from "../components/Header";
import Panel from "../components/Panel";

import { imagePreview } from "../scripts";

const LocationEditPage = (e) => {
  let history = useHistory();
  const {
    selectedLocation,
    setSelectedLocation,
    locationData,
    setLocationData,
    worldData,
    residentData,
    allTags,
    allDangers,
    allBiomes,
  } = useContext(WorldsContext);

  const { userData } = useContext(AuthContext);

  const [locationName, setLocationName] = useState("");
  const [builder, setBuilder] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [imageUpload, setImageUpload] = useState(null);

  let initialTagState = [];
  allTags.forEach((tag) => {
    initialTagState.push({
      name: tag.tag_name,
      value: parseInt(tag.id),
      isChecked: false,
    });
  });

  let initialDangerState = [];
  allDangers.forEach((danger) => {
    initialDangerState.push({
      name: danger.danger_name,
      value: parseInt(danger.id),
      isChecked: false,
    });
  });

  let initialBiomeState = [];
  allBiomes.forEach((biome) => {
    initialBiomeState.push({
      name: biome.biome_name,
      value: parseInt(biome.id),
      isChecked: false,
    });
  });

  const [checkedBiomes, setCheckedBiomes] = useState(initialBiomeState);
  const [checkedTags, setCheckedTags] = useState(initialTagState);
  const [checkedDangers, setCheckedDangers] = useState(initialDangerState);

  useEffect(() => {
    setLocationName(selectedLocation.location_name);
    setLocationDescription(selectedLocation.location_description);
    setBuilder(selectedLocation.builder);

    locationBiomes();
    locationDangers();
  }, []);

  const locationBiomes = () =>
    selectedLocation.biomes.forEach((biome) => {
      // console.log(typeof(biome))
      // console.log(checkedBiomes.map(e => e.name).indexOf(biome), 'biome')
      handleOnChange(checkedBiomes.map((e) => e.name).indexOf(biome), "biome");
    });

  const locationDangers = () =>
    selectedLocation.dangers.forEach((danger) => {
      // console.log(typeof(danger))
      // console.log(checkedDangers.map(e => e.name).indexOf(danger), 'danger')
      handleOnChange(
        checkedDangers.map((e) => e.name).indexOf(danger),
        "danger"
      );
    });

  const handleOnChange = (position, type) => {
    if (type === "biome") {
      const updatedCheck = checkedBiomes;
      updatedCheck[position].isChecked = !updatedCheck[position].isChecked;
      setCheckedBiomes([...updatedCheck]);
    } else if (type === "danger") {
      console.log(position);
      const updatedCheck = checkedDangers;
      updatedCheck[position].isChecked = !updatedCheck[position].isChecked;
      setCheckedDangers([...updatedCheck]);
    }
  };

  const handleCheckBoxBiomes = () => {
    let tagsToSend = [];
    checkedBiomes.map((checkbox, index) => {
      if (checkbox.isChecked === true) {
        tagsToSend.push(index + 1);
      }
    });
    return tagsToSend;
  };

  const uploadImageHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: { "content-type": "multipart/form-data" },
    };

    let imageFormData = new FormData();
    imageFormData.append("location-image", imageUpload);
    imageFormData.append("added_by", userData.id);
    imageFormData.append("entity_id", selectedLocation.id);

    try {
      const serverData = await publicFetch.post(
        `/images`,
        imageFormData,
        config
      );
      setSelectedLocation(serverData.data.data.selectedLocation[0]);
      //serverData.data.updatedGallery
    } catch (err) {
      console.log(err);
    }
  };

  const updateLocationHandler = async (e) => {
    e.preventDefault();
    try {
      const updatedLocation = await publicFetch.put(
        `/locations/${selectedLocation.id}`,
        {
          location_name: locationName,
          location_description: locationDescription,
          builder,
          biome: handleCheckBoxBiomes(),
        }
      );
      history.push(`/locations/${selectedLocation.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Header />
      <main>
        <Panel />
        <section className="main-container">
          <Link to={`/locations/${selectedLocation.id}`}>&#8592;</Link>
          {Object.entries(selectedLocation).length !== 0 && (
            <div className="location-edit">
              <h1>Editing {selectedLocation.location_name}</h1>
              <form encType="multipart/form-data">
                <label>
                  Main image
                  <input
                    type="file"
                    name="location-image"
                    onChange={(e) => setImageUpload(e.target.files[0])}
                    multiple
                  ></input>
                  <img
                    id="image-preview"
                    src={
                      imageUpload !== null && URL.createObjectURL(imageUpload)
                    }
                  />
                  <div className="gallery">{selectedLocation.i}</div>
                </label>
                <button type="submit" onClick={uploadImageHandler}>
                  Upload Image
                </button>
              </form>

              <form>
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
                  {checkedBiomes &&
                    checkedBiomes.length > 0 &&
                    checkedBiomes.map(({ name, value, isChecked }, index) => {
                      return (
                        <li key={index}>
                          <label>
                            <input
                              type="checkbox"
                              name="biome"
                              checked={isChecked}
                              onChange={() => handleOnChange(index, "biome")}
                              value={value}
                            />
                            <span>{name}</span>
                          </label>
                        </li>
                      );
                    })}
                </ul>
                <h3>Local Dangers:</h3>
                <ul>
                  {checkedDangers &&
                    checkedDangers.length > 0 &&
                    checkedDangers.map(({ name, value, isChecked }, index) => {
                      return (
                        <li key={index}>
                          <label>
                            <input
                              type="checkbox"
                              name="danger"
                              checked={isChecked}
                              onChange={() => handleOnChange(index, "danger")}
                              value={value}
                            />
                            <span>{name}</span>
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