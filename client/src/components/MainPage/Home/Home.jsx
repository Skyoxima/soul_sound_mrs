import React, { useEffect, useState } from 'react'
import { IconContext } from 'react-icons'
import { AiFillPlayCircle } from 'react-icons/ai'
import apiClient from '../../../spotify';
import './Home.css';
function Home({ setCurrTrack }) {
    const [newReleases, setNewReleases] = useState(null);
    const [topCategories, setTopCategories] = useState(null);
    const [likedSongs, setLikedSongs] = useState(null);
    useEffect(() => {
        apiClient.get("browse/new-releases?limit=5").then((res) => {
            setNewReleases(res.data.albums.items);
        })
        apiClient.get("browse/categories?limit=5").then((res) => {
            setTopCategories(res.data.categories.items);
        })
        apiClient.get('me/tracks?limit=5').then(res => {
            setLikedSongs(res.data.items.map(item => { return item.track }));
        })
    }, [])
    const handlePlayTrack = (currSong) => {
        setCurrTrack(currSong);
    }

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
                            onClick={() => handlePlayTrack(newRelease)}
                        >
                            <img
                                src={newRelease.images[0].url}
                                className="homecard-image"
                                alt="Playlist-Art"
                            />
                            <p className="homecard-title">{newRelease.name}</p>
                            <div className="homecard-fade">
                                <IconContext.Provider value={{ size: "35px", color: "#E99D72" }}>
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
                                <IconContext.Provider value={{ size: "35px", color: "#E99D72" }}>
                                    <AiFillPlayCircle />
                                </IconContext.Provider>
                            </div>
                        </div>
                    ))}
                </div>
                <h2 className='home-title'>Liked Songs</h2>
                <div className='homecards'>
                    {likedSongs?.map((likedSong) => (
                        <div
                            className="homecard"
                            key={likedSong.id}
                            onClick={() => handlePlayTrack(likedSong)}
                        >
                            <img
                                src={likedSong.album.images[0].url}
                                className="homecard-image"
                                alt="Playlist-Art"
                            />
                            <p className="homecard-title">{likedSong.name}</p>
                            <div className="homecard-fade">
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

export default Home