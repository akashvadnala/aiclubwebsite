import React from "react";
import "./Search.css";

const Search = (props) => {
  return (
  <div className="searchBar-wrap">
    <form onSubmit={props.formSubmit}>
      <input
        type="text"
        placeholder="Search"
        value={props.value}
        onChange={props.handleSearchKey}
      />
      {props.value && <button onClick={props.clearSearch} className="mx-1">X</button>}
      <button className="mx-1">Go</button>
    </form>
  </div>
)};

export default Search;
