import React, { useState, useEffect, createContext } from "react";

export const WorldsContext = createContext();

export const WorldsContextProvider = (props) => {
  const [allWorlds, setAllWorlds ] = useState([]);
  const [allLocations, setAllLocations ] = useState([]);
  const [selectedWorld, setSelectedWorld] = useState({});
  const [selectedLocation, setSelectedLocation] = useState({});
  const [selectedLocationGallery, setSelectedLocationGallery] = useState({});
  const [allTags, setAllTags] = useState([]);
  const [myLocations, setMyLocations] = useState([])
  const [residentData, setResidentData] = useState([])
  const [allBiomes, setAllBiomes] = useState([])
  const [searchResults, setSearchResults] = useState(null);

  const addWorlds = (world) => {
    setAllWorlds([...allWorlds, world]);
  };

  const addLocations = (location) => {
    setAllLocations([...allLocations, location]);
  };
  
  useEffect( () => {
    const getLocalStorage = () => {
      if(localStorage.getItem('selectedWorld')){
        const world = JSON.parse(localStorage.getItem('selectedWorld'))
        setAllWorlds(world)
      }
      if(localStorage.getItem('selectedLocation')){
        const location = JSON.parse(localStorage.getItem('selectedLocation'))
        setSelectedLocation(location)

        
      if(localStorage.getItem('selectedLocationGallery')){
        const gallery = JSON.parse(localStorage.getItem('selectedLocationGallery'))
        setSelectedLocationGallery(gallery)
      }
      
      }
      if(localStorage.getItem('searchResults')){
        const prevSearch = JSON.parse(localStorage.getItem('searchResults'))
        setSearchResults(prevSearch)
      }

    }
    getLocalStorage()
},[]);
  
const setLocalStorage = (dataType, data) => {
  return localStorage.setItem(dataType, JSON.stringify(data))
}

const removeLocalStorage = (key) => {
   localStorage.removeItem(key)
}

  return (
    <WorldsContext.Provider
      value={{
        allWorlds,
        setAllWorlds,
        addWorlds,
        selectedWorld,
        setSelectedWorld,
        setLocalStorage,
        removeLocalStorage,
        allLocations,
        setAllLocations,
        selectedLocation,
        setSelectedLocation,
        selectedLocationGallery,
        setSelectedLocationGallery,
        addLocations,
        allTags, 
        setAllTags,
        allBiomes,
        setAllBiomes,
        residentData, 
        setResidentData,
        myLocations, 
        setMyLocations,
        searchResults,
        setSearchResults
      }}
    >
      {props.children}
    </WorldsContext.Provider>
  );
};