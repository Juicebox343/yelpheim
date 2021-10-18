import {useContext} from 'react'
import { WorldsContext } from '../context/WorldsContext';
import {Link} from 'react-router-dom';
import meadowThumb from '../images/meadow_thumbnail.png';
import blackforestThumb from '../images/blackforest_thumbnail.png';
import swampThumb from '../images/swamp_thumbnail.png';
import mountainThumb from '../images/mountain_thumbnail.png';
import plainsThumb from '../images/plains_thumbnail.png';
import mistlandsThumb from '../images/mistlands_thumbnail.png';
import ashlandsThumb from '../images/ashlands_thumbnail.png';
import deepnorthThumb from '../images/deepnorth_thumbnail.png';
import oceanThumb from '../images/ocean_thumbnail.png';

const BiomeList = () => {
  const {selectedWorld} = useContext(WorldsContext);
    
  return (
    <div className="sub-container">
      <h2>Browse {selectedWorld && selectedWorld.world_name} by Biome</h2>
      <ul className='biomeBrowse'>
          <div>
              <li className='hoverHands'><Link to=""><img src={meadowThumb} alt=''/>Meadows</Link></li>
              <li className='hoverHands'><Link to=""><img src={blackforestThumb} alt=''/>Black Forest</Link></li>
              <li className='hoverHands'><Link to=""><img src={swampThumb} alt=''/>Swamp</Link></li>
          </div>
          <div>
              <li className='hoverHands'><Link to=""><img src={mountainThumb} alt=''/>Mountain</Link></li>
              <li className='hoverHands'><Link to=""><img src={plainsThumb} alt=''/>Plains</Link></li>
              <li className='hoverHands'><Link to=""><img src={mistlandsThumb} alt=''/>Mistlands</Link></li>
          </div>
          <div>
              <li className='hoverHands'><Link to=""><img src={ashlandsThumb} alt=''/>Ashlands</Link></li>
              <li className='hoverHands'><Link to=""><img src={deepnorthThumb} alt=''/>Deep North</Link></li>
              <li className='hoverHands'><Link to=""><img src={oceanThumb} alt=''/>Ocean</Link></li>
          </div>
      </ul>
    </div>
  )
}

export default BiomeList
