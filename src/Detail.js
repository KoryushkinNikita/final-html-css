import React from 'react';

const Detail = ({album, artists, name}) => {

    return (
        <div className="songDetail" >
            <div>
                <img
                    className="songAlbum"
                    src={album.images[0].url}
                    alt={name}>
                </img>
            </div>
            <div className="songName textStyle">
                <label htmlFor={name} className="form-label col-sm-12">
                    {name}
                </label>
            </div>
            <div className="artistName textStyle">
                <label htmlFor={artists[0].name} className="form-label col-sm-12">
                    {artists[0].name}
                </label>
            </div>
        </div>
    );
}

export default Detail;
