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
  const [song, setSong] = useState({songImage:'', songOwner:'',songName:''});

  useEffect(() => {

      axios(`https://api.spotify.com/v1/tracks/2FeBslNBMdR9V58uv6hd2t`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + localStorage.token}
      })
      .then (songResponse => {
        setSong({
          songImage:songResponse.data.album.images[0].url,
          songOwner:songResponse.data.artists[0].name,
          songName:songResponse.data.name
        })

      }).catch(function (error) {
	         console.error(error);
        });


  },[]);

return (
    <div className="TrackBox">
          <div className="album">
            <img className="trackImage" src={song.songImage}></img>
            <label className="trackName">{song.songName}</label>
            <label className="trackOwner">{song.songOwner}</label>
          </div>
    </div>

  );
}

export default AlbumsOnMainPage;
