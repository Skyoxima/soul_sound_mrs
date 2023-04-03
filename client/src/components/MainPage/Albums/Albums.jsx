import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './Albums.css';
// import apiClient from '../../../spotify';

function Albums() {
    const [albums, setAlbums] = useState(null);
    useEffect(() => {
        axios.get("https://saavn.me/modules?language=hindi,english").then(res => {
            setAlbums(res.data.data.albums.slice(0, 8));
            console.log(res.data.data.albums.slice(0, 8));
        })
    }, [])

    return (
        <div className="albums">
            <h2>Album</h2>
            <div className="albums-content">
                {albums?.map((album) => (
                    <div
                        className="album-card"
                        key={album?.id}
                    // onClick={() => playPlaylist(playlist.id)}
                    >
                        <img
                            src={album?.image[2]?.link}
                            // src={"https://img.freepik.com/free-icon/user_318-804790.jpg"}
                            className="album-image"
                            alt="Playlist-Art"
                            width={"100px"}
                        />
                        <p className="album-title">{album?.name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Albums