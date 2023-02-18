import React, { useEffect, useState } from 'react'
import { IconContext } from 'react-icons';
import { AiFillPlayCircle } from 'react-icons/ai';
import apiClient from '../../../spotify';

function Albums() {
    const [albums, setAlbums] = useState(null);
    useEffect(() => {
        apiClient.get("me/albums").then((res) => {
            console.log(res.data.items);
        })
    }, [])

    return (
        <div className="albums">
            <div className="albums-content">
                <h2>Album</h2>
                {albums?.map((album) => (
                    <div
                        className="album-card"
                        key={album.id}
                    // onClick={() => playPlaylist(playlist.id)}
                    >
                        <img
                            src={album.images[0].url}
                            className="album-image"
                            alt="Playlist-Art"
                        />
                        <p className="album-title">{album.name}</p>
                        <p className="album-subtitle">{album.tracks.total} Songs</p>
                        <div className="album-fade">
                            <IconContext.Provider value={{ size: "50px", color: "#E99D72" }}>
                                <AiFillPlayCircle />
                            </IconContext.Provider>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    )
}

export default Albums