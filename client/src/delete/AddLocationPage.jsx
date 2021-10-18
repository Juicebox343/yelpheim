import React, {useState, useContext} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import { WorldsContext } from '../context/WorldsContext';
import {publicFetch} from "../apis/fetch";
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';

const AddLocationPage = () => {

    const [addedLocationName, setAddedLocationName] = useState(""); 
    const [locationDescription, setLocationDescription] = useState(""); 
    const [builderUser, setBuilderUser] = useState(""); 
    const [residentData, setResidentData] = useState([])
    const [biome, setBiome] = useState(); 
    const {selectedWorld, addLocations} = useContext(WorldsContext);
    const {username, world_id} = useParams();
    const authContext = useContext(AuthContext)
    const loggedInUser = authContext.authState.userData;
    let history = useHistory()
    // const [builderUser, setbuilderUser] = useState("Resident");

           
    const addLocationHandler = async (e) =>{
        
        e.preventDefault();
        try {
            const response = await publicFetch.post(`${username}/worlds/${world_id}/locations`, {
                location_name: addedLocationName,
                location_description: locationDescription,
                biome,
                builder_username: builderUser,
                world_id: selectedWorld.id,
                added_by: loggedInUser.username
            });
            addLocations(response.data.data.location_id)
            history.goBack();
        } catch(err){
            console.log(err);
        }
    };


    return (
        <main>
            <Header/>
            <div className="addLocationForm">
                <form enctype='multipart/form-data'>
                    <h2>Add New Location</h2>
                    <label>
                        Location Name
                        <input type="text" name="location-name" value={addedLocationName} onChange={e => setAddedLocationName(e.target.value)}/>
                    </label>
                    <label>
                        Location Description
                        <textarea value={locationDescription} onChange={(e) => setLocationDescription(e.target.value)}></textarea>
                    </label>
                    <label>
                        Biome:
                        <select className="form-select" value={biome} onChange={(e) => setBiome(e.target.value)}>
                                <option key='meadow' value='meadow'>Meadow</option>
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
                    <label>
                    Built by:
                    <select className="form-select" value={builderUser} onChange={(e) => setBuilderUser(e.target.value)}>
                        <option disabled>Resident</option>
                        <option key={0} value='Unlisted'>Unlisted</option>
                        {residentData > 0 && residentData.map(resident =>{
                            return(
                                <option key={resident.username} value={resident.username}>{resident.first_name}</option>
                            )
                        })}
                    </select>
                    </label>
                    <input type='file' name='locationImage' multiple></input>
                    <button type='submit' onClick={addLocationHandler}>Add Location</button>
                </form>
            </div>
        </main>
        
    )
}

export default AddLocationPage
