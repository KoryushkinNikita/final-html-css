import React, { useState, useEffect } from 'react';
import Listbox from './Listbox';
import Dropdown from "./Dropdown";
import Detail from './Detail';
import { Info } from './Info';
import SideBar from './sidebar'
import axios from 'axios';

const AlbumsOnMainPage = () => {

  const [token, setToken] = useState('');
  const [genres, setGenres] = useState({selectedGenre: '', listOfGenresFromAPI: []});
  const [playlist, setPlaylist] = useState({selectedPlaylist: '', listOfPlaylistFromAPI: []});
  const [tracks, setTracks] = useState({selectedTrack: '', listOfTracksFromAPI: []});
  const [trackDetail, setTrackDetail] = useState(null);
  const [artist, setArtist] = useState({artistImage:'', artistName:''});

  useEffect(() => {

      axios(`https://api.spotify.com/v1/artists/69GGBxA162lTqCwzJG5jLp`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + localStorage.token}
      })
      .then (artistsResponse => {
        setArtist({
          artistImage:artistsResponse.data.images[0].url,
          artistName:artistsResponse.data.name
        })


      }).catch(function (error) {
	         console.error(error);
        });



  },[]);

return (
    <div className="artistsBox">
          <div className="artists">
            <img className="artistImage" src={artist.artistImage}></img>
            <label className="personalArtistName">{artist.artistName}</label>
          </div>
    </div>

  );
}

export default AlbumsOnMainPage;
