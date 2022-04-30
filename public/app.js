const APIController = (function() {

    const clientId = 'e91988fcc1674aa88374f24be4844f85';
    const clientSecret = '10badbb697f544ecb15e1efd7659a0b0';


    /**
    * @description Функция получения Токена Spotify
    */
    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        }).catch(err => alert(err));

        const data = await result.json();
        return data.access_token;
    }
    /**
    * @description Функция получения жанров
    * @param {string} token - токен Spotify
    */
    const _getGenres = async (token) => {

        const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_RU`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        }).catch(err => alert(err));

        const data = await result.json();
        return data.categories.items;
    }
    /**
    * @description Функция получения плейлистов по подходящему жанру
    * @param {string} token - токен Spotify
    * @param {string} genreId - id заданного жанра
    */
    const _getPlaylistByGenre = async (token, genreId) => {

        const limit = 10;

        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        }).catch(err => alert(err));

        const data = await result.json();
        return data.playlists.items;
    }

    /**
    * @description Функция получения списка песен
    * @param {string} token - токен Spotify
    * @param {string} tracksEndPoint - ссылка для получения API ответа с информацией про песни в плейлисте
    */
    const _getTracks = async (token, tracksEndPoint) => {

        const limit = 10;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        }).catch(err => alert(err));

        const data = await result.json();
        return data.items;
    }
    /**
    * @description Функция получения информации о песне
    * @param {string} token - токен Spotify
    * @param {string} tracksEndPoint - ссылка для получения API ответа с информацией про песню
    */
    const _getTrack = async (token, trackEndPoint) => {

        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        }).catch(err => alert(err));

        const data = await result.json();
        return data;
    }
    /**
    * @description Функция получения информации о плейлисте
    * @param {string} token - токен Spotify
    * @param {string} id - id плейлиста
    */
    const _getPlaylist = async (token, id) => {

        const result = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        }).catch(err => alert(err));

        const data = await result.json();
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
        getGenres(token) {
            return _getGenres(token);
        },
        getPlaylistByGenre(token, genreId) {
            return _getPlaylistByGenre(token, genreId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        },
        getPlaylist(token,id){
          return _getPlaylist(token, id);
        }
    }
})();


const UIController = (function() {

    const DOMElements = {
        selectGenre: '#select_genre',
        selectPlaylist: '#select_playlist',
        buttonSubmit: '#btn_submit',
        divSongDetail: '#song-detail',
        hfToken: '#hidden_token',
        divSonglist: '.song-list'
    }

    return {

        inputField() {
            return {
                genre: document.querySelector(DOMElements.selectGenre),
                playlist: document.querySelector(DOMElements.selectPlaylist),
                tracks: document.querySelector(DOMElements.divSonglist),
                submit: document.querySelector(DOMElements.buttonSubmit),
                songDetail: document.querySelector(DOMElements.divSongDetail)
            }
        },
        /**
        * @description Функция создания жанров для <option>
        * @param {string} text - название жанра
        * @param {string}  value - id жанра
        */
        createGenre(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
        },
        /**
        * @description Функция создания плейлистов для <option>
        * @param {string} text - название плейлиста
        * @param {string}  value - id плейлиста
        */
        createPlaylist(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
        },
        /**
        * @description Функция создания списка треков
        * @param {string} name - название песни
        * @param {string} id - id песни
        */
        createTrack(id, name) {
            const html = `<li><a href="#" class="songOfPlaylist" id="${id}">${name}</a></li>`;
            document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
        },
        /**
        * @description Функция создания элемента песни в html
        * @param {string} img - ссылка на изображение обложки
        * @param {string} title - название песни
        * @param {string} artist - имя артиста
        */
        createTrackDetail(img, title, artist) {

            const detailDiv = document.querySelector(DOMElements.divSongDetail);
            detailDiv.innerHTML = '';

            const html =
            `
            <div class="trackInfo">
              <div class="trackImage">
                <img src="${img}" class=trackIMG alt="">
            </div>
            <div class="trackTitle">
                <label for="Genre" class="tracktitle">${title}</label>
            </div>
            <div class="trackArtist">
                <label for="artist" class="trackartist">By ${artist}</label>
            </div>
            <div>
            `;

            detailDiv.insertAdjacentHTML('beforeend', html)
        },

        /**
        * @description Функция создания элемента песни в html при загрузке страницы
        * @param {string} img - ссылка на изображение обложки
        * @param {string} title - название песни
        * @param {string} artist - имя артиста
        */

        createTrackDetailimmediately(img, title, artist) {
          let elements = document.querySelectorAll('.boxesSongs')

          elements.forEach(element => {

            const html =
            `
            <div class="albumPhoto">
              <img src="${img}" class="albumSongPhoto" alt="">
            </div>
            <div class="albumName">
                <label for="boxesSongs" class="albumSongTitle"><b>${title}</b></label>
            </div>
            <div class="albumArtist">
                <label for="boxesSongs" class="albumOwner">${artist}</label>
            </div>
            `;

            element.insertAdjacentHTML('beforeend', html);
          });
        },

        /**
        * @description Функция создания элемента альбома в html при загрузке страницы
        * @param {string} img - ссылка на изображение обложки
        * @param {string} name - название плейлиста
        * @param {string} artist - имя артиста
        */

        createPlaylistDetail(name,img, artist) {

            let elements = document.querySelectorAll('.boxes')

            elements.forEach(element => {
              const html =

              `
              <div class="playlistPhoto">
                <img src="${img}" class="songPhoto" alt="">
              </div>
              <div class="playlistName">
                  <label for="boxes" class="SongTitle"><b>${name}</b></label>
              </div>
              <div class="playlistArtist">
                  <label for="boxes" class="PlaylistOwner">${artist}</label>
              </div>
              `;

              element.insertAdjacentHTML('beforeend', html);

            });
          },
          /**
          * @description Функция очистки элемента песни в html
          */
        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = '';
        },
        /**
        * @description Функция очистки списка песен
        */
        resetTracks() {
            this.inputField().tracks.innerHTML = '';
            this.resetTrackDetail();
        },
        /**
        * @description Функция очистки списка плейлистов
        */
        resetPlaylist() {
            this.inputField().playlist.innerHTML = '';
            this.resetTracks();
        },
        /**
        * @description Функция сохранения токена
        */
        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;
        },
        /**
        * @description Функция получения сохраненного токена
        */
        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.hfToken).value
            }
        }
    }

})();

const APPController = (function(UICtrl, APICtrl) {

    const DOMInputs = UICtrl.inputField();
    /**
    * @description Функция загрузки плейлистов, песен и жанров при загрузке страницы
    */
    const loadGenresAndPlaylists = async () => {

        const token = await APICtrl.getToken();

        UICtrl.storeToken(token);

        const genres = await APICtrl.getGenres(token);

        genres.forEach(element => UICtrl.createGenre(element.name, element.id));

        const playlist = await APICtrl.getPlaylist(token, '3PZTFPQhr0vHnYGwFUvQco');

        UICtrl.createPlaylistDetail(playlist.name, playlist.images[0].url,playlist.artists[0].name);

        const track = await APICtrl.getTrack(token, 'https://api.spotify.com/v1/tracks/1rDQ4oMwGJI7B4tovsBOxc');

        UICtrl.createTrackDetailimmediately(track.album.images[2].url, track.name, track.artists[0].name);
    }

    /**
    * @description Функция создания <option> с подходящими плейлистами при выранном жанре
    */
    DOMInputs.genre.addEventListener('change', async () => {

        UICtrl.resetPlaylist();

        const token = UICtrl.getStoredToken().token;

        const genreSelect = UICtrl.inputField().genre;

        const genreId = genreSelect.options[genreSelect.selectedIndex].value;

        const playlist = await APICtrl.getPlaylistByGenre(token, genreId);

        playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));
    });


    /**
    * @description Функция создания списка песен для выранного плейлиста
    */
    DOMInputs.submit.addEventListener('click', async (e) => {

        e.preventDefault();

        UICtrl.resetTracks();

        const token = UICtrl.getStoredToken().token;

        const playlistSelect = UICtrl.inputField().playlist;

        const tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;

        const tracks = await APICtrl.getTracks(token, tracksEndPoint);

        tracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name))

    });

    /**
    * @description Функция создания элемента в html с информацией о выбранном треке
    */
    DOMInputs.tracks.addEventListener('click', async (e) => {

        e.preventDefault();

        UICtrl.resetTrackDetail();

        const token = UICtrl.getStoredToken().token;

        const trackEndpoint = e.target.id;

        const track = await APICtrl.getTrack(token, trackEndpoint);

        UICtrl.createTrackDetail(track.album.images[2].url, track.name, track.artists[0].name);
    });

    return {
        init() {
            console.log('App is starting');
            loadGenresAndPlaylists();
        }
    }

})(UIController, APIController);


APPController.init();
