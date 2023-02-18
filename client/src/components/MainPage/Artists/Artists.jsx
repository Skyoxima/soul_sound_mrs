import React, { useEffect, useState } from 'react'
import { IconContext } from 'react-icons';
import { AiFillPlayCircle } from 'react-icons/ai';
import apiClient from '../../../spotify';
import './Artists.css';

function Artists() {

    const [artists, setArtists] = useState(null);
    useEffect(() => {
        apiClient.get("me/following?type=artist&limit=8").then((res) => {
            setArtists(res.data.artists.items);
            // console.log(res.data.artists.items);
        })
    }, [])

    return (
        <div className="artists">
            <h2>Artists</h2>
            <div className="artists-content">
                {artists?.map((artist) => (
                    <div className="artist-card" key={artist.id}>
                        <img
                            src={artist.images[0].url}
                            className="artist-image"
                            alt="artist-Art"
                        />
                        <p className="artist-title">{artist.name}</p>
                        {/* <p className="artist-subtitle">{artist.tracks.total} Songs</p> */}
                        <div className="artist-fade">
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

export default Artists