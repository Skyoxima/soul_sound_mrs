import React, { useEffect, useState } from 'react'
import './TopCollections.css';
import apiClient from '../../spotify';
import { IconContext } from 'react-icons';
import { AiFillPlayCircle } from "react-icons/ai";


function TopCollections() {
    const [playlists, setPlaylists] = useState(null);
    useEffect(() => {
        apiClient.get("me/playlists").then((res) => {
            setPlaylists(res.data.items);
            console.log(res.data.items);
        })
    }, [])
    return (
        <div className="top-collections">
            <div className="top-collections-content">
                {playlists?.map((playlist) => (
                    <div
                        className="playlist-card"
                        key={playlist.id}
                    // onClick={() => playPlaylist(playlist.id)}
                    >
                        <img
                            src={playlist.images[0].url}
                            className="playlist-image"
                            alt="Playlist-Art"
                        />
                        <p className="playlist-title">{playlist.name}</p>
                        <p className="playlist-subtitle">{playlist.tracks.total} Songs</p>
                        <div className="playlist-fade">
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

export default TopCollections