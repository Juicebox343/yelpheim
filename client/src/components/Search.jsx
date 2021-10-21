import React, { useContext, useEffect, useState } from "react";
import { publicFetch } from "../apis/fetch";
import { WorldsContext } from "../context/WorldsContext";
import { useHistory, Link } from "react-router-dom";
import { sendingText } from "../scripts";

const Search = () => {
  let history = useHistory();
  const { selectedWorld, allTags, searchResults, setSearchResults, setLocalStorage } = useContext(WorldsContext);

 
  const [userSearch, setUserSearch] = useState("");

  const doSearch = async (e, userSearch) => {
    e.preventDefault();
    try {
      const response = await publicFetch.get(
        `/search/${userSearch}`
      );
      setSearchResults(response.data.data.searchResults);
      setLocalStorage('searchResults', response.data.data.searchResults)
      history.push(`/search?${userSearch}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="searchContainer">
      <form>
        <h2>
          <label htmlFor="locationSearch">
            Search {selectedWorld && selectedWorld.world_name}
          </label>
        </h2>
        <div>
          <input
            type="text"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            id="locationSearch"
            placeholder="Bed, Black Forest, Forge (Level 5)"
          ></input>
          <button
            class="attentionButton"
            type="submit"
            onClick={(e) => doSearch(e, userSearch)}
          >
            Search
          </button>
        </div>
        <ul className="truncatedTagList">
          {allTags.length > 0 && (
            <li>
              <Link to={`/tags/${allTags[2].tag_name}`}>
                {allTags[2].tag_name}
              </Link>
            </li>
          )}
          {allTags.length > 0 && (
            <li>
              <Link to={`/tags/${allTags[15].tag_name}`}>
                {allTags[15].tag_name}
              </Link>
            </li>
          )}
          {allTags.length > 0 && (
            <li>
              <Link to={`/tags/${allTags[8].tag_name}`}>
                {allTags[8].tag_name}
              </Link>
            </li>
          )}
          {allTags.length > 0 && (
            <li>
              <Link to={`/tags/${allTags[21].tag_name}`}>
                {allTags[21].tag_name}
              </Link>
            </li>
          )}
        </ul>
      </form>
    </div>
  );
};

export default Search;
