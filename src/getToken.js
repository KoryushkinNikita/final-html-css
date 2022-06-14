import React, { useState, useEffect } from 'react';
import Listbox from './Listbox';
import Dropdown from "./Dropdown";
import Detail from './Detail';
import { Info } from './Info';
import SideBar from './sidebar'
import axios from 'axios';

const GetToken = () => {

  const spotify = Info();

  const [token, setToken] = useState('');

  useEffect(() => {

   axios('https://accounts.spotify.com/api/token', {
     headers: {
       'Content-Type' : 'application/x-www-form-urlencoded',
       'Authorization' : 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)
     },
     data: 'grant_type=client_credentials',
     method: 'POST'
   })
   .then(tokenResponse => {
     localStorage.my_token = tokenResponse.data.access_token
}).catch(function (error) {
     console.error(error);
  });

 }, [spotify.ClientId, spotify.ClientSecret]);
 
  return null;
}

export default GetToken;
