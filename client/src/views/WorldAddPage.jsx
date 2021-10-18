import React, {useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import { WorldsContext } from '../context/WorldsContext';
import {publicFetch} from "../apis/fetch";
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
import Panel from '../components/Panel';

const WorldAddPage = () => {

    const [addedWorldName, setAddedWorldName] = useState(""); 
    const [seed, setSeed] = useState("");
    const [worldBosses, setWorldBosses] = useState("");
    const {addWorlds} = useContext(WorldsContext);
    const {userData} = useContext(AuthContext);
    let history = useHistory()

    const addWorldHandler = async (e) =>{
        e.preventDefault();
        try {
            const response = await publicFetch.post(`worlds`, {
                world_name: addedWorldName,
                owner_username: userData.username,
                seed,
                bosses_defeated: worldBosses
            });
            addWorlds(response.data.data.id)
            history.goBack();
        } catch(err){
            console.log(err);
        }
    }

    return (

        <main>
            <Header/>
            <Panel/>
            <div className='addWorldForm'>      
                <form>
                    <h2>Add New World</h2>
                    <label>
                        World Name
                        <input type="text" name="location-name" value={addedWorldName} onChange={e => setAddedWorldName(e.target.value)}/>
                    </label>
                    <label>
                        Seed:
                        <input type="text" name="location-name" value={seed} onChange={e => setSeed(e.target.value)}/>
                    </label>
                    <label>
                        Bosses Defeated:
                        <select className="form-select" value={worldBosses} onChange={(e) => setWorldBosses(e.target.value)}>
                            <option key='none' value='0'>None.</option>
                            <option key='eikthyr' value='1'>Eikthyr</option>
                            <option key='elder' value='2'>The Elder</option>
                            <option key='bonemass' value='3'>Bonemass</option>
                            <option key='moder' value='4'>Moder</option>
                            <option key='yagluth' value='5'>Yagluth</option>
                        </select>
                    </label>
                    <button type='submit' onClick={addWorldHandler}>Add World</button>
                </form>
            </div>
        </main>
        
    )
}

export default WorldAddPage




