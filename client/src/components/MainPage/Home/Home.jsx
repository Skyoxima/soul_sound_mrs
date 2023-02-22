import React, { useEffect, useState } from 'react'
import { IconContext } from 'react-icons'
import { AiFillPlayCircle } from 'react-icons/ai'
import apiClient from '../../../spotify';
import './Home.css';
function Home() {
    const [newReleases, setNewReleases] = useState(null);
    const [topCategories, setTopCategories] = useState(null);
    useEffect(() => {
        apiClient.get("browse/new-releases?limit=5").then((res) => {
            console.log(res.data.albums.items);
            setNewReleases(res.data.albums.items);
        })
        apiClient.get("browse/categories?limit=5").then((res) => {
            console.log(res.data.categories.items);
            setTopCategories(res.data.categories.items);
        })
    }, [])

    return (
        <div className="main-container">
            <div className="home-content">
                <h2>Home</h2>
                <h2 className='home-title'>Top Releases</h2>
                <div className='homecards'>
                    {newReleases?.map((newRelease) => (
                        <div
                            className="homecard"
                            key={newRelease.id}
                        // onClick={() => playPlaylist(playlist.id)}
                        >
                            <img
                                src={newRelease.images[0].url}
                                className="homecard-image"
                                alt="Playlist-Art"
                            />
                            <p className="homecard-title">{newRelease.name}</p>
                            <div className="homecard-fade">
                                <IconContext.Provider value={{ size: "30px", color: "#E99D72" }}>
                                    <AiFillPlayCircle />
                                </IconContext.Provider>
                            </div>
                        </div>
                    ))}
                </div>
                <h2 className='home-title'>Top Categories</h2>
                <div className='homecards'>
                    {topCategories?.map((topCategory) => (
                        <div
                            className="homecard"
                            key={topCategory.id}
                        >
                            <img
                                src={topCategory.icons[0].url}
                                className="homecard-image"
                                alt="Playlist-Art"
                            />
                            <p className="homecard-title">{topCategory.name}</p>
                            <div className="homecard-fade">
                                <IconContext.Provider value={{ size: "50px", color: "#E99D72" }}>
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

export default Home