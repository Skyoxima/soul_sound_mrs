import React, { useEffect, useState } from 'react'
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
        <div className="main-container">
            <div className="artists-content">
                <h2>Artists</h2>
                <div className='artists-cards'>
                    {artists?.map((artist) => (
                        <div className="artist-card" key={artist.id}>
                            <img
                                src={artist.images[0].url}
                                alt="artist-Art"
                            />
                            <p className="artist-title">{artist.name}</p>
                            {/* <p className="artist-subtitle">{artist.tracks.total} Songs</p> */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Artists