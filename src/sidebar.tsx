import React, {useEffect} from 'react';
import Home from './img/home.svg';
import Heart from './img/heart.svg'
import Songs from './mySongs'
import Profile from './profileInfo'


function SideBar() {
  return (
    <div className="sideBar">
      <span className="spotify">Spotify</span>
      <div className="homeButton">
        <img className="homeImage" src={Home} alt="home"/>
        <label className="homeText">Home</label>
      </div>
      <div className="favouriteTracks">
        <img className="heart" src={Heart} alt="favourite Tracks"/>
        <label className="heartText">Favourite Tracks</label>
      </div>
      <input type="text" placeholder="Search" className="search"></input>
      <hr className="whiteLine"/>
      <Songs />
      <Profile />
    </div>
  );

}

export default SideBar;
