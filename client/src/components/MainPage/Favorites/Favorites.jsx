import React, { useEffect, useState } from 'react'
import { IconContext } from 'react-icons';
import { AiFillPlayCircle } from 'react-icons/ai';
import apiClient from '../../../spotify';
import './Favorites.css';

function Favorites() {
    const [favorites, setFavorites] = useState(null);
    useEffect(() => {
        apiClient.get("me/playlists").then((res) => {
            setFavorites(res.data.items);
        })
    }, [])
    return (
        <div className="main-container">
            <div className="favorites-content">
                <h2>Favorites</h2>
                <div className='favorite-cards'>
                    {favorites?.map((favorite) => (
                        <div className="favorite-card" key={favorite.id}>
                            <img
                                src={favorite.images[0]?.url}
                                className="favorite-image"
                                alt="favorite-Art"
                            />
                            <p className="favorite-title">{favorite.name}</p>
                            <div className="favorite-fade">
                                <IconContext.Provider value={{ size: "35px", color: "#E99D72" }}>
                                    <AiFillPlayCircle />
                                </IconContext.Provider>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Favorites