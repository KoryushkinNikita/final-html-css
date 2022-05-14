const APIController = (function() {

  const clientId = 'e91988fcc1674aa88374f24be4844f85';
  const clientSecret = '10badbb697f544ecb15e1efd7659a0b0';

  const send = async (url,params) => {
      let token = localStorage.my_token;
      if (!token || (Date.now() - localStorage.token_at > 3600 * 3)){
        const result = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
          },
          body: 'grant_type=client_credentials'
        }).catch(err => alert(err.message));
        const data = await result.json();
        token = data.access_token;
        localStorage.my_token = token;
        localStorage.token_at = Date.now();
      }

     if (!params) {
       params = {
         method: 'GET',
         headers: {
           'Authorization': 'Bearer ' + token
         }
       };
     }

     try {
       const result = await fetch(`${url}`, params);

       const data = await result.json();

       if (data.error) {
         return null;
       }
       return data;

    } catch (error) {
      alert(error.message);
    }
    return null;
  }

  return {
    /**
     * @description Функция получения жанров
     */
  async getGenres() {
      const data = await send(`https://api.spotify.com/v1/browse/categories?locale=sv_RU`);
        if (data)
          return data.categories.items;
        return null
    },
    /**
     * @description Функция получения плейлистов по подходящему жанру
     * @param {string} genreId - id заданного жанра
     */
    async getPlaylistByGenre(genreId) {
      const data = await send(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=10`);
        if (data)
          return data.playlists.items;
        return null
    },
    /**
     * @description Функция получения списка песен
     * @param {string} tracksEndPoint - ссылка для получения API ответа с информацией про песни в плейлисте
     */
    async getTracks(tracksEndPoint) {
        const data = await send(`${tracksEndPoint}?limit=10`);
        if (data)
          return data.items;
        return null
    },
    /**
     * @description Функция получения информации о песне
     * @param {string} tracksEndPoint - ссылка для получения API ответа с информацией про песню
     */
    async getTrack(trackEndPoint) {
      const result = await send(`${trackEndPoint}`);
      if (result)
        return result
      return null
    },
    /**
     * @description Функция получения информации о плейлисте
     * @param {string} id - id плейлиста
     */
    async getPlaylist(id) {
      const result = await send(`https://api.spotify.com/v1/albums/${id}`);
      if (result)
        return result
      return null
    }
  }
})();


const UIController = (function() {

  const getElementTemplate = (type, name, img, artist) => {

    return (
      `
    <div class="${type}Photo ">
      <img src="${img}" class="songPhoto photo" alt="">
    </div>
    <div class="${type}Name">
        <label for="boxes" class="SongTitle"><b>${name}</b></label>
    </div>
    <div class="${type}Artist">
        <label for="boxes" class="PlaylistOwner">${artist}</label>
    </div>
    `)

  }

  const DOM_Elements = {
    selectGenre: '#select_genre',
    selectPlaylist: '#select_playlist',
    buttonSubmit: '#btn_submit',
    SongDetail: '#song-detail',
    divSonglist: '.song-list'
  }

  return {

    inputField : {
    genre: document.querySelector(DOM_Elements.selectGenre),
    playlist: document.querySelector(DOM_Elements.selectPlaylist),
    tracks: document.querySelector(DOM_Elements.divSonglist),
    submit: document.querySelector(DOM_Elements.buttonSubmit),
    songDetail: document.querySelector(DOM_Elements.SongDetail)
  }


    ,
    /**
     * @description Функция создания жанров для <option>
     * @param {string} text - название жанра
     * @param {string}  value - id жанра
     */

    addOption(selector, text, value){
      const options = `<option value="${value}">${text}</option>`;
      if (selector == 'Genre')
      this.inputField.genre.insertAdjacentHTML('beforeend', options);
      else if (selector == 'playlist')
      this.inputField.playlist.insertAdjacentHTML('beforeend', options);
    },
    /**
     * @description Функция создания списка треков
     * @param {string} name - название песни
     * @param {string} id - id песни
     */
    createTrack(id, name) {
      const track = `<li><a href="#" class="songOfPlaylist" id="${id}">${name}</a></li>`;
      this.inputField.tracks.insertAdjacentHTML('beforeend', track);
    },
    /**
     * @description Функция создания элемента песни в html
     * @param {string} img - ссылка на изображение обложки
     * @param {string} title - название песни
     * @param {string} artist - имя артиста
     */
    createTrackDetail(img, title, artist) {

      const detailDiv = this.inputField.songDetail;

      detailDiv.innerHTML = '';

      trackDetail =
      `
    <div class="trackDetailPhoto">
      <img src="${img}" class="DetailPhoto" alt="">
    </div>
    <div class="trackDetailName">
        <label for="boxes" class="DetailName"><b>${title}</b></label>
    </div>
    <div class="trackDetailArtist">
        <label for="boxes" class="DetailOwner">${artist}</label>
    </div>
    `

      detailDiv.insertAdjacentHTML('beforeend', trackDetail);
    },


    /**
     * @description Функция создания элемента альбома в html при загрузке страницы
     * @param {string} img - ссылка на изображение обложки
     * @param {string} name - название плейлиста
     * @param {string} artist - имя артиста
     */


    createDetail(type, name, img, artist) {

        let elements = document.querySelectorAll(`.${type}`);

        elements.forEach(element => {

        element.insertAdjacentHTML('beforeend', getElementTemplate(type, name, img, artist));

      });
    },
    /**
     * @description Функция очистки элемента песни в html
     */
    resetTrackDetail() {
      this.inputField.songDetail.innerHTML = '';
    },
    /**
     * @description Функция очистки списка песен
     */
    resetTracks() {
      this.inputField.tracks.innerHTML = '';
      this.resetTrackDetail();
    },
    /**
     * @description Функция очистки списка плейлистов
     */
    resetPlaylist() {
      this.inputField.playlist.innerHTML = '';
      this.resetTracks();
    },
  }

})();

const APPController = (function(UICtrl, APICtrl) {

  const DOMInputs = UICtrl.inputField;
  /**
   * @description Функция загрузки жанров при загрузке страницы
   */
  const loadGenres = async () => {

    const genres = await APICtrl.getGenres();

    if (genres)

      genres.forEach(element => UICtrl.addOption('Genre',element.name, element.id));


  }


  /**
   * @description Функция загрузки плейлистов при загрузке страницы
   */
  const loadPlaylists = async () => {

    const playlist = await APICtrl.getPlaylist('3PZTFPQhr0vHnYGwFUvQco');

    if (playlist)

      UICtrl.createDetail('playlist', playlist.name, playlist.images[0].url, playlist.artists[0].name);
  }

  /**
   * @description Функция загрузки песен при загрузке страницы
   */
  const loadSongs = async () => {

    const track = await APICtrl.getTrack('https://api.spotify.com/v1/tracks/?ids=1rDQ4oMwGJI7B4tovsBOxc');

    if (track)

      UICtrl.createDetail('album', track.tracks[0].name, track.tracks[0].album.images[2].url,track.tracks[0].artists[0].name);
  }

  /**
   * @description Функция создания <option> с подходящими плейлистами при выранном жанре
   */
  DOMInputs.genre.addEventListener('change', async () => {

    UICtrl.resetPlaylist();

    const genreSelect = DOMInputs.genre;

    if (genreSelect.value != 'Select Genre'){

      const genreId = genreSelect.options[genreSelect.selectedIndex].value;

      if (genreId) {

        const playlists = await APICtrl.getPlaylistByGenre(genreId);

        if (playlists)

          playlists.forEach(p => UICtrl.addOption('playlist',p.name, p.tracks.href));
    }
  }
  });


  /**
   * @description Функция создания списка песен для выранного плейлиста
   */
  DOMInputs.submit.addEventListener('click', async (e) => {

    e.preventDefault();

    UICtrl.resetTracks();

    const genreSelect = DOMInputs.genre;

    const playlistSelect = DOMInputs.playlist;

    if (playlistSelect.value != 'Select Playlist' || genreSelect.value != 'Select Genre'){

      const tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;

      if (tracksEndPoint) {

        const tracks = await APICtrl.getTracks(tracksEndPoint);

        if (tracks)

          tracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name))
      }
    }

  });

  /**
   * @description Функция создания элемента в html с информацией о выбранном треке
   */
DOMInputs.tracks.addEventListener('click', async (e) => {

    e.preventDefault();

    UICtrl.resetTrackDetail();

    const trackEndpoint = e.target.id.slice(34);

    if (trackEndpoint){

      const track = await APICtrl.getTrack(`https://api.spotify.com/v1/tracks/?ids=${trackEndpoint}`);

      if (track)

        UICtrl.createTrackDetail(track.tracks[0].album.images[2].url, track.tracks[0].name, track.tracks[0].artists[0].name);
    }
  });

  return {
    init() {
      loadGenres();
      loadPlaylists();
      loadSongs();
    }
  }

})(UIController, APIController);

localStorage.clear();
APPController.init();
