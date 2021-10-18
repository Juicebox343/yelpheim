import React, {useContext, useState, useEffect} from 'react';
import { WorldsContext } from '../context/WorldsContext';
import { useHistory, Link} from 'react-router-dom'
import {publicFetch} from "../apis/fetch";
import Header from '../components/Header';
import Panel from '../components/Panel';

const WorldEditPage = () => {
    let history = useHistory();
    const {selectedWorld, setSelectedWorld, setWorldData, worldData} = useContext(WorldsContext);
    const [name, setName] = useState(""); 
    const [seed, setSeed] = useState("");
    const [worldBosses, setWorldBosses] = useState("");

    useEffect(() => {
        setName(selectedWorld.world_name);
        setSeed(selectedWorld.seed);
        setWorldBosses(selectedWorld.bosses_defeated);  
    }, []);


    const updateWorldHandler = async (e) =>{
        e.preventDefault();
        const updatedWorld = await publicFetch.put(`/worlds/${selectedWorld.id}`, {
            world_name: name,
            seed,
            bosses_defeated: worldBosses
        })
        history.push("/")
    }

    
    const handleWorldDelete = async (e, id) =>{
        try{
            const response = await publicFetch.delete(`/worlds/${selectedWorld.id}`);
            setWorldData(worldData.filter(world => {
                return world.id !== id
            }))
        } catch(err){
            console.log(err)
        }
        history.push("/")
    };

    return (
        <main className='world-edit-page'>
            <Header/>
            <Panel/>
            <section className='main-container'>
                <Link to='/'>&#8592;</Link>
                {selectedWorld && 
                <div>
                    <h1>Editing {selectedWorld.world_name}</h1>
                    <form>
                        <label>
                            World Name
                            <input type="text" name="location-name" value={name} onChange={e => setName(e.target.value)}/>
                        </label>
                        <label>
                            Seed:
                            <input type="text" name="location-name" value={seed} onChange={e => setSeed(e.target.value)}/>
                        </label>
                            Bosses Defeated:
                            <select className="form-select" value={worldBosses} onChange={(e) => setWorldBosses(e.target.value)}>
                                <option disabled>Biome</option>
                                <option key='none' value='0'>None</option>
                                <option key='eikthyr' value='1'>Eikthyr</option>
                                <option key='elder' value='2'>The Elder</option>
                                <option key='bonemass' value='3'>Bonemass</option>
                                <option key='moder' value='4'>Moder</option>
                                <option key='yagluth' value='5'>Yagluth</option>
                            </select>
                        <button type='submit' onClick={updateWorldHandler}>Update World</button>
                    </form>
                    <button onClick={(e) => handleWorldDelete(e, selectedWorld.id)}>Delete</button>
                    <span>{selectedWorld.location_description}</span>
                </div>  
            }
        </section>
        </main>
    )
}

export default WorldEditPage
