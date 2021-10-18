import {useContext, useEffect} from 'react';
import { WorldsContext } from '../context/WorldsContext';
import {useHistory, Redirect, useParams, Link} from 'react-router-dom';
import {publicFetch} from "../apis/fetch";
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
import Panel from '../components/Panel';

const WorldIndexPage = () => {
    return (
        <div>
          WORLD INDEX PAGE
        </div>
      )
    }

export default WorldIndexPage
