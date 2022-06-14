import React, { useState, useEffect } from 'react';
import Listbox from './Listbox';
import Dropdown from "./Dropdown";
import Detail from './Detail';
import { Info } from './Info';
import GenreSearch from './genreSearch'
import AlbumsOnMainPage from './albumsTitles'
import axios from 'axios';


const MainPage = () => {

  return (
    <div className="mainPage">
      <label className="SpecialForYouLabel">Special For You</label>
      <AlbumsOnMainPage />
      <label className="SelectGenreLabel">Find a song for you</label>
      <GenreSearch />
    </div>

  );
}

export default MainPage;
