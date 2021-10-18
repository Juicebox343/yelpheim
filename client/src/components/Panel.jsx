import React, { useContext, useEffect, useState } from "react";
import {
  Redirect,
  useLocation,
  useHistory,
  Link,
  useParams,
} from "react-router-dom";
import { publicFetch } from "../apis/fetch";
import { AuthContext } from "../context/AuthContext";
import { WorldsContext } from "../context/WorldsContext";

import { bossHelper, bossMessage, shuffle } from "../scripts";
import BiomeList from "../components/BiomeList";

const Panel = () => {
  let history = useHistory();

  const { userData, logout, isLoggedIn } = useContext(AuthContext);
  const {
    worldData,
    setWorldData,
    selectedWorld,
    setSelectedWorld,
    setLocationData,
    setMyLocations,
    residentData,
    setResidentData,
    setLocalStorage,
    removeLocalStorage,
  } = useContext(WorldsContext);

  const [worldSelect, setWorldSelect] = useState(selectedWorld.id || "--");

  const handleWorldUpdate = async (e, id) => {
    history.push(`/worlds/${id}/edit`);
  };

  const worldSelectHandler = async (e) => {
    const world = worldData.find((x) => x.id === e.target.value);
    setWorldSelect(e.target.world_name);
    setSelectedWorld(world);
    setLocalStorage("selectedWorld", world);

    if (e.target.value !== "--") {
      try {
        const response = await publicFetch.get(`/worlds/${e.target.value}`);
        setWorldData(response.data.data.world_data);
        setLocationData(response.data.data.location_data);
        setResidentData(response.data.data.resident_data);
        setMyLocations(response.data.data.my_locations);
        history.push("/");
      } catch (err) {
        console.log(err);
      }
    } else {
      clearWorldSelectHandler();
    }
  };

  const clearWorldSelectHandler = async (e) => {
    setWorldSelect("World Select");
    setSelectedWorld("");
    setLocationData("");
    removeLocalStorage("selectedWorld");
    removeLocalStorage("selectedLocation");
    history.push("/success");
    history.push("/");
  };

  const logoutHandler = (e) => {
    logout(e);
    history.push("/success");
    history.push("/");
  };

  return (
    <aside>
      {isLoggedIn ? (
        <span>Hey {userData.first_name}</span>
      ) : (
        <span>
          Have an account? <Link to="/login">Login</Link>{" "}
        </span>
      )}
      <p>My Locations</p>
      <p>My Favorites</p>
      {/* <div className='worldSelect'>
            <div>
                <label htmlFor='world-select'>World Select</label>
                <div className='customSelect'>
                    <select id='world-select' className="form-select" value={worldSelect} onChange={(e) => worldSelectHandler(e)}>
                        <option>--</option>
                        {typeof worldData !== 'undefined' && worldData !== '--' && Object.keys(worldData).map(function(key){
                            return <option key={worldData[key].id} value={worldData[key].id}>{worldData[key].world_name}</option>
                        })}
                    </select>
                    <span className="focus"></span>
                </div>
            </div>
            <button className='clearSelection' onClick={(e)=> clearWorldSelectHandler(e)}>Clear</button>
            <Link to={`/${userData.username}/worlds/new`}>+</Link>
        </div> */}

      {/* <div className='worldInfo'>
            <div>
                <h2>{selectedWorld.world_name || "Select a world"} <button onClick={(e) => handleWorldUpdate(e, selectedWorld.id)}>Edit</button></h2>
                <p>Seed: {selectedWorld.seed}</p>
            </div>
            
            <div>
                <ul>
                    <span>Residents:</span>
                    {selectedWorld && residentData.map((resident)=>{
                    return <li key={resident.id} className='bossList'>{resident.first_name}</li>    
                    })
                    }
                </ul>
            </div>

            <div>
                <span>Bosses Defeated: </span>
                <ul>
                    {bossHelper(selectedWorld.bosses_defeated).map((boss)=>{
                    return <li key={boss} className='bossList'>{boss}</li>    
                    })
                    }
                </ul>
                <p className='bossMessage'>{bossMessage(selectedWorld.bosses_defeated)}</p>
            </div>
        </div> */}

      <button type="submit" onClick={logoutHandler}>
        Logout
      </button>
    </aside>
  );
};

export default Panel;
