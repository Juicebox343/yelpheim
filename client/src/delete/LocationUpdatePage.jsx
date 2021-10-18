import React, {useContext, useState, useEffect} from 'react';
import { WorldsContext } from '../context/WorldsContext';
import { useHistory, useParams } from 'react-router-dom'
import {publicFetch} from "../apis/fetch";

const LocationUpdatePage = (e) => {
    const {username, world_id, location_id} = useParams();
    let history = useHistory();
    const {selectedLocation, setSelectedLocation, locationData, setLocationData, } = useContext(WorldsContext);

    const [locationName, setLocationName] = useState(""); 
    const [locationDescription, setLocationDescription] = useState(""); 
    const [biome, setBiome] = useState(""); 

    useEffect(() => {
        setLocationName(selectedLocation.location_name);
        setLocationDescription(selectedLocation.location_description);
        setBiome(selectedLocation.biome);
    }, []);


    const updateLocationHandler = async (e) =>{
        e.preventDefault();
        const updatedLocation = await publicFetch.put(`/${username}/worlds/${world_id}/locations/${location_id}/update`, {
            location_name: locationName,
            location_description: locationDescription,
            biome,
            // builder_username: builderUser,
        })
        history.push("/")
    }

    return (
        <div>
            {selectedLocation && 
            <div>
                <h1>Editing {selectedLocation.location_name}</h1>
                <form>
                <h2>Add New Location</h2>
                <label>
                Location Name
                <input type="text" name="location-name" value={locationName} onChange={e => setLocationName(e.target.value)}/>
                </label>
                <label>
                Location Description
                <textarea value={locationDescription} onChange={(e) => setLocationDescription(e.target.value)}></textarea>
                </label>
                <label>
                Biome:
                <select className="form-select" value={biome} onChange={(e) => setBiome(e.target.value)}>
                        <option disabled>Biome</option>
                        <option key='meadow' value='meadows'>Meadow</option>
                        <option key='blackforest' value='black forest'>Black Forest</option>
                        <option key='swamp' value='swamp'>Swamp</option>
                        <option key='mountain' value='mountain'>Mountain</option>
                        <option key='plains' value='plains'>Plains</option>
                        <option key='mistlands' value='mistlands'>Mistlands</option>
                        <option key='ashlands' value='ashlands'>Ashlands</option>
                        <option key='deepnorth' value='deep north'>Deep North</option>
                        <option key='ocean' value='ocean'>Ocean</option>
                </select>
                </label>
                {/* <label>
                Built by:
                <select className="form-select" value={builderUser} onChange={(e) => setbuilderUser(e.target.value)}>
                    <option disabled>Resident</option>
                    <option key={0} value='Unlisted'>Unlisted</option>
                    {worldData.residents && worldData.residents.map(resident =>{
                        return(
                            <option key={resident.username} value={resident.username}>{resident.first_name}</option>
                        )
                    })}
                </select>
                </label> */}
                <button type='submit' onClick={updateLocationHandler}>Update Location</button>
            </form>
            </div>
                
            }
        </div>
    )
}

export default LocationUpdatePage
