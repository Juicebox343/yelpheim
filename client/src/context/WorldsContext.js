import React, { useState, useEffect, createContext } from "react";
import { publicFetch } from "../apis/fetch";


export const WorldsContext = createContext();

export const WorldsContextProvider = (props) => {
  const [allWorlds, setAllWorlds ] = useState([]);
  const [allLocations, setAllLocations ] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [allDangers, setAllDangers] = useState([]);
  const [allBiomes, setAllBiomes] = useState([])

  const [selectedWorld, setSelectedWorld] = useState({});
  const [selectedLocation, setSelectedLocation] = useState({});
  const [selectedLocationGallery, setSelectedLocationGallery] = useState({});

  const [myLocations, setMyLocations] = useState([])
  const [residentData, setResidentData] = useState([])

  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await publicFetch.get("/");
        setAllLocations(response.data.data.allLocations);
        setAllWorlds(response.data.data.myWorlds);
        setAllTags(response.data.data.tags);
        setAllBiomes(response.data.data.biomes);
        setAllDangers(response.data.data.dangers);
        setMyLocations(response.data.data.myLocations);
        console.log(response.data.data)
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

    useEffect( () => {
    
    const getLocalStorage = () => {
      // if(localStorage.getItem('tagList') && JSON.parse(localStorage.getItem('tagList'))){
      //   const tagList = JSON.parse(localStorage.getItem('tagList'))
      //   setAllTags(tagList)
      // }
      // if(localStorage.getItem('biomeList') && JSON.parse(localStorage.getItem('biomeList'))){
      //   const biomeList = JSON.parse(localStorage.getItem('biomeList'))
      //   setAllBiomes(biomeList)
      // }
      // if(localStorage.getItem('dangerList') && JSON.parse(localStorage.getItem('dangerList'))){
      //   const dangerList = JSON.parse(localStorage.getItem('dangerList'))
      //   setAllDangers(dangerList)
      // }
      if(localStorage.getItem('selectedWorld') && JSON.parse(localStorage.getItem('selectedWorld')) !== undefined){
        const world = JSON.parse(localStorage.getItem('selectedWorld'))
        setAllWorlds(world)
      }
      if(localStorage.getItem('selectedLocation') && JSON.parse(localStorage.getItem('selectedLocation')) !== undefined){
        const location = JSON.parse(localStorage.getItem('selectedLocation'))
        setSelectedLocation(location)
      }
      if(localStorage.getItem('selectedLocationGallery')){
        const gallery = JSON.parse(localStorage.getItem('selectedLocationGallery'))
        setSelectedLocationGallery(gallery)
      }
      if(localStorage.getItem('searchResults')){
        const prevSearch = JSON.parse(localStorage.getItem('searchResults'))
        setSearchResults(prevSearch)
      }
    }
    getLocalStorage()
},[]);




const addWorlds = (world) => {
  setAllWorlds([...allWorlds, world]);
};

const addLocations = (location) => {
  setAllLocations([...allLocations, location]);
};
  
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
        allDangers,
        setAllDangers,
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






        // setLocalStorage(
        //   "tagList",
        //   response.data.data.tags
        // );
        // setLocalStorage(
        //   "biomeList",
        //   response.data.data.biomes
        // );
        // setLocalStorage(
        //   "dangerList",
        //   response.data.data.dangers
        // );

//   useEffect( () => {
//     setLocalStorage()
// },[]);
  
