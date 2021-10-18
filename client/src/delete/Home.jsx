import React, {useContext, useEffect, useState} from 'react';
import {publicFetch} from "../apis/fetch";
import { WorldsContext } from '../context/WorldsContext';
import { AuthContext } from '../context/AuthContext';
import {useHistory, Link, useParams} from 'react-router-dom';
import {bossHelper, bossMessage, shuffle} from '../scripts';
import Header from '../components/Header';

const Home = (props) => {
    let history = useHistory();
        const {username} = useParams();
        const { worldData, setWorldData, 
                selectedWorld, setSelectedWorld, 
                selectedLocation, setSelectedLocation, 
                locationData, setLocationData, 
                addLocations, addWorlds, 
                tagData, setTagData,
                myLocations, setMyLocations,
                residentData, setResidentData} = useContext(WorldsContext);

        const [addWorldVisibility, setAddWorldVisibility] = useState(false);
        const [addLocationVisibility, setAddLocationVisibility] = useState(false);

        const [worldSelect, setWorldSelect] = useState("--");
        const authContext = useContext(AuthContext)

        useEffect( () => {
            const fetchData = async () => {
                try{
                    const response = await publicFetch.get(`/${username}`);
                    setWorldData(response.data.data.world_data);  
                    setTagData(response.data.data.tag_data);
                    // if(selectedWorld !== ""){
                    //     const rememberSelected = response.data.data.world_data.find(x => x.id === selectedWorld.id)
                    //     setWorldSelect(selectedWorld.world_name)
                    //     setSelectedWorld( rememberSelected)
                    // }
                } catch (err){
                    console.log(err)
                }
            };
            fetchData();
        },[]);

        
    const logoutHandler = (e) =>{
        e.preventDefault();
        try {
            const request = publicFetch.get(`logout`);
            authContext.setAuthState({})
            history.push(`/`)
        } catch(err){
            console.log(err);
        }
    };    
        const handleWorldUpdate = async (e, id) =>{
            history.push(`/worlds/${id}/update`);
        };
    

        const worldSelectHandler = async (e) =>{
            const world = worldData.find(x => x.id === e.target.value)
            setWorldSelect(e.target.world_name)
            setSelectedWorld(world)
            if(e.target.value !== '--'){
                try{
                    const response = await publicFetch.get(`/${username}/worlds/${e.target.value}`);
                    setWorldData(response.data.data.world_data);
                    setLocationData(response.data.data.location_data);
                    setResidentData(response.data.data.resident_data);  
                    setMyLocations(response.data.data.my_locations);            
                
                } catch(err){
                    console.log(err)
                }
            } else{
                clearWorldSelectHandler()
            }
           
        }

        const clearWorldSelectHandler = async (e) =>{
            setWorldSelect("World Select")
            setSelectedWorld("")
            setLocationData("")
            history.push(`/success`)
            history.push(`/${username}`)
        }

 
       


        
return (
    <main className='homePage'>
        <Header/>
        <aside>
            <span className='greeting'>Hey, {authContext.authState.userData.first_name}</span>
            <div className='worldSelect'>
                <div>
                    <label htmlFor='world-select'>World Select</label>
                    <div className='customSelect'>
                        <select id='world-select' className="form-select" value={worldSelect} onChange={(e) => worldSelectHandler(e)}>
                            <option>--</option>
                            {typeof worldData !== 'undefined' && Object.keys(worldData).map(function(key){
                                return <option key={worldData[key].id} value={worldData[key].id}>{worldData[key].world_name}</option>
                            })}
                        </select>
                        <span className="focus"></span>
                    </div>
                </div>
                <button className='clearSelection' onClick={(e)=> clearWorldSelectHandler(e)}>Clear</button>
                <Link to={`/${username}/worlds/new`}>+</Link>
            </div>
                
            <div className='worldInfo'>
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

            </div>

            <button type='submit' onClick={logoutHandler}>Logout</button>
        </aside>

      

        <div className='container'>
            <div className='searchContainer'>
                <form>
                    <h2><label htmlFor='locationSearch'>Search {selectedWorld && selectedWorld.world_name}</label></h2>
                    <div><input type='text' id='locationSearch' placeholder='Bed, Black Forest, Forge (Level 5)'></input><button class='attentionButton' type='submit'>Search</button></div>
                    <ul className='truncatedTagList'>
                        {tagData.length > 0 && <li><Link to={`/${username}/worlds/${selectedWorld.id}/tags/${tagData[2].tag_name}`}>{tagData[2].tag_name}</Link></li>}
                        {tagData.length > 0 && <li><Link to={`/${username}/worlds/${selectedWorld.id}/tags/${tagData[15].tag_name}`}>{tagData[15].tag_name}</Link></li>}
                        {tagData.length > 0 && <li><Link to={`/${username}/worlds/${selectedWorld.id}/tags/${tagData[8].tag_name}`}>{tagData[8].tag_name}</Link></li>}
                        {tagData.length > 0 && <li><Link to={`/${username}/worlds/${selectedWorld.id}/tags/${tagData[21].tag_name}`}>{tagData[21].tag_name}</Link></li>}
                    </ul>
                </form>
            </div>
        {myLocations > 0 && myLocations[0].builder_username === username && 
            <div className="locationListContainer">
                <h2>Your Locations</h2>
                <ul className='locationList'>
                    {locationData.length > 0 && locationData.map(location => {
                        return(
                            <li key={location.id} className='hoverHands'> 
                                <Link to={`/${username}/worlds/${selectedWorld.id}/locations/${location.id}`}><h3>{`${location.location_name}`}</h3></Link>
                            </li>
                        )
                    })}
                    <li className='addLocationLink'><Link to={`/${username}/worlds/${selectedWorld.id}/locations/new`}>Add New Location</Link></li>
                </ul>
            </div>
        }
            <div className="locationListContainer">
                <h2>Recently Added to {selectedWorld && selectedWorld.world_name}</h2>
                <ul className='locationList'>
                    {locationData.length > 0 && locationData.map(location => {
                        return(
                            <li key={location.id} className='hoverHands'> 
                                <Link to={`/${username}/worlds/${selectedWorld.id}/locations/${location.id}`}><h3>{`${location.location_name}`}</h3></Link>
                                {/* <div>
                                    <button onClick={(e) => handleLocationUpdate(e, location.id)}>Update</button>
                                    <button onClick={(e) => handleLocationDelete(e, location.id)}>Delete</button>
                                </div> */}
                            </li>
                        )
                    })}
                    <li className='addLocationLink'><Link to={`/${username}/worlds/${selectedWorld.id}/locations/new`}>Add New Location</Link></li>
                </ul>
            </div>
           <div className="biomeBrowseContainer">
                <h2>Browse {selectedWorld && selectedWorld.world_name} by Biome</h2>
                <ul className='biomeBrowse'>
                    <div>
                        <li className='hoverHands'><Link to="">Meadows</Link></li>
                        <li className='hoverHands'><Link to="">Black Forest</Link></li>
                        <li className='hoverHands'><Link to="">Swamp</Link></li>
                    </div>
                    <div>
                        <li className='hoverHands'><Link to="">Mountain</Link></li>
                        <li className='hoverHands'><Link to="">Plains</Link></li>
                        <li className='hoverHands'><Link to="">Mistlands</Link></li>
                    </div>
                    <div>
                        <li className='hoverHands'><Link to="">Ashlands</Link></li>
                        <li className='hoverHands'><Link to="">Deep North</Link></li>
                        <li className='hoverHands'><Link to="">Ocean</Link></li>
                    </div>
                </ul>
            </div>
         
        </div>

        
    </main>
)}

export default Home