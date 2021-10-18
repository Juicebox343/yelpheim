import React, {useContext} from 'react'
import SingleResult from '../components/SingleResult';
import { WorldsContext } from "../context/WorldsContext";
import Header from "../components/Header";
import Panel from "../components/Panel";
import Search from '../components/Search';


const SearchResults = () => {
  const { searchResults } = useContext(WorldsContext);
  console.log(searchResults)

  
  return (
    <>
    <Header />
    <main className="search-results">

      <Panel/>
      <section className="main-container">
      <Search />
      <ul className="searchResults">
        {searchResults !== null && searchResults.length > 0 && searchResults.map((result) => {
            return <SingleResult result={result}/>;
          })}
      </ul>
      </section>
      </main>
    </>
  )
}

export default SearchResults
