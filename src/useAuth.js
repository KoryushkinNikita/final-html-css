import { useState, useEffect } from "react"
import { Info } from './Info';
import axios from "axios"

export default function useAuth() {
  const [accessToken, setAccessToken] = useState()
  const [refreshToken, setRefreshToken] = useState()
  const [expiresIn, setExpiresIn] = useState()

  const spotify = Info();

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
      setAccessToken(tokenResponse.data.access_token)
      setExpiresIn(tokenResponse.data.expires_in)
 }).catch(function (error) {
      console.error(error);
   });

  }, [spotify.ClientId, spotify.ClientSecret]);

  useEffect(() => {
    if (!expiresIn || !accessToken) return
    const interval = setInterval(() => {
      axios('https://accounts.spotify.com/api/token', {
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded',
          'Authorization' : 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)
        },
        data: 'grant_type=client_credentials',
        method: 'POST'
      })
      .then(tokenResponse => {
        setAccessToken(tokenResponse.data.access_token)
        setExpiresIn(tokenResponse.data.expires_in)
   }).catch(function (error) {
        console.error(error);
     });
   }, expiresIn * 60)

    return () => clearInterval(interval)
  }, [expiresIn])

  if (accessToken){
    return accessToken}
  else return null
}
