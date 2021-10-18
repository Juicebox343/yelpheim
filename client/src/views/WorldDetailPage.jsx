import {useContext, useEffect} from 'react';
import { WorldsContext } from '../context/WorldsContext';
import {useHistory, useParams, Link} from 'react-router-dom';
import {publicFetch} from "../apis/fetch";
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
import Panel from '../components/Panel';


export const WorldDetailPage = () => {
  let history = useHistory();
  const {username, world_id, location_id} = useParams();
  const { worldData, setWorldData, 
          selectedWorld, setSelectedWorld, 
          selectedLocation, setSelectedLocation,
          setLocalStorage, 
          locationData, setLocationData, 
          addLocations, addWorlds, 
          tagData, setTagData,
          myLocations, setMyLocations} = useContext(WorldsContext);
  
  const {userData, logout} = useContext(AuthContext)

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

  useEffect( () => {
      const fetchData = async () => {
          try{
              const response = await publicFetch.get(`${username}/worlds/${world_id}/locations/${location_id}`);
              console.log(response)
              setSelectedLocation(response.data.data.location_data[0])
              setLocalStorage('selectedLocation',response.data.data.location_data[0])
          } catch (err){
              console.log(err)
          }
      };
      fetchData();
  },[]);

  return (
    <main className='world-detail-page'>
        <Header/>
        <Panel/>
        <section className='main-container'>
        <Link to='/'>&#8592;</Link>
              {selectedLocation && 
              <div>
                  <h1>{selectedLocation.location_name}</h1>
                  <p>Nestled in the {selectedLocation.biome} biome</p>
                  <p>{selectedLocation.location_description}</p>
                  <p>Built by {selectedLocation.builder_username === "" ? 'Unlisted' : selectedLocation.builder_username}</p>
                  <p>Added by {selectedLocation.added_by}</p>
                  <div>
                      <Link to={`/${userData && userData.username}/worlds/${selectedWorld.id}/locations/${selectedLocation.id}/update`}>Edit Location</Link>
                      <button className='warning-button' onClick={(e) => handleLocationDelete(e, selectedLocation.id)}>Delete Location</button>
                  </div>
              </div>
                  
              }
          </section>
      </main>

  )
}
