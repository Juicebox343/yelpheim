import React, {useContext, useEffect} from 'react';
import { WorldsContext } from '../context/WorldsContext';
import {useHistory, useParams} from 'react-router-dom';
import {publicFetch} from "../apis/fetch";
import Header from '../components/Header';

const LocationDetailPage = () => {
    let history = useHistory();
    const {username, world_id, location_id} = useParams();
    const { worldData, setWorldData, 
            selectedWorld, setSelectedWorld, 
            selectedLocation, setSelectedLocation, 
            locationData, setLocationData, 
            userData, setUserData, 
            addLocations, addWorlds, 
            tagData, setTagData,
            myLocations, setMyLocations} = useContext(WorldsContext);

    const handleLocationDelete = async (e, id) =>{
        try{
            const response = await publicFetch.delete(`/locations/${id}`);
            setLocationData(locationData.filter(location => {
                return location.id !== id
            }))
        } catch(err){
            console.log(err)
        }
        history.goBack();
    };

    const handleLocationUpdate = async (e, id) =>{
        const location = locationData.find(x => x.id === e.target.value)
        setSelectedLocation(location)
        history.push(`${userData.username}/worlds/${selectedWorld.id}/locations/${id}/update`);
    };

    useEffect( () => {
        const fetchData = async () => {
            try{
                const response = await publicFetch.get(`${username}/worlds/${world_id}/locations/${location_id}`);
                console.log(response)
                setSelectedLocation(response.data.data.location_data[0])
            } catch (err){
                console.log(err)
            }
        };
        fetchData();
    },[]);

    return (
        <main>
            <Header/>
            <div>
                {selectedLocation && 
                <div>
                    <h1>{selectedLocation.location_name}</h1>
                    <span>{selectedLocation.location_description}</span>
                    <div>
                        <button onClick={(e) => handleLocationUpdate(e, selectedLocation.id)}>Update</button>
                        <button onClick={(e) => handleLocationDelete(e, selectedLocation.id)}>Delete</button>
                    </div>
                </div>
                    
                }
            </div>
        </main>

    )
}

export default LocationDetailPage
