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
  const [album, setAlbum] = useState({albumImage:''});

  useEffect(() => {

      axios(`https://api.spotify.com/v1/albums/3PZTFPQhr0vHnYGwFUvQco`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + localStorage.token}
      })
      .then (albumResponse => {
        setAlbum({
          albumImage:albumResponse.data.images[0].url
        })


      }).catch(function (error) {
	         console.error(error);
        });



  },[]);

return (
    <div className="albumsLine">
          <div className="album">
            <img className="albumImage" src={album.albumImage}></img>
          </div>
          <div className="album">
            <img className="albumImage" src={album.albumImage}></img>
          </div>
          <div className="album">
            <img className="albumImage" src={album.albumImage}></img>
          </div>
    </div>

  );
}

export default AlbumsOnMainPage;
