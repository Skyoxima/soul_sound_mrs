import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { currTrackContext } from '../../../App';
import './Home.css';

function Home() {
    const [charts, setCharts] = useState([]);
    const { setCurrTrack } = useContext(currTrackContext);
    useEffect(() => {
        // SPOTIFY CODE
        // apiClient.get("browse/new-releases?limit=5").then((res) => {
        //     setNewReleases(res.data.albums.items);
        // })
        // apiClient.get("browse/categories?limit=5").then((res) => {
        //     setTopCategories(res.data.categories.items);
        // })
        // apiClient.get('me/tracks?limit=5').then(res => {
        //     setLikedSongs(res.data.items.map(item => { return item.track }));
        // })

        // SAAVN CODE
        if (charts.length === 0) {
            axios.get("https://saavn.me/modules?language=hindi,english")
                .then(res => {
                    return res.data.data.charts.slice(0, 5);
                })
                .then(res => {
                    res.forEach(ele => {
                        const chartId = ele.id;
                        const chartTitle = ele.title;
                        axios.get(`https://saavn.me/playlists?id=${chartId}`).then(response => {
                            setCharts(prevState => [...prevState, { title: chartTitle, songs: response.data.data.songs.slice(0, 5) }]);
                        })
                    })
                })
        }
        else {
            return;
        }

        // axios.get('http://localhost:3001/csvdata')
        //     .then((response) => {
        //         setAllSongs(response.data.slice(100, 105)); // the CSV data in JSON format
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     });
    }, [])
    console.log(charts);
    const handlePlayTrack = (currSong) => {
        setCurrTrack(currSong);
    }
    return (
        <div className="main-container">
            <div className="home-content">
                <h2>Home</h2>
                {/* OPTIMISED */}
                {charts.map(chart => {
                    return (<>
                        <h2 className='home-title'>{chart.title}</h2>
                        <div className='homecards' key={chart.title}>
                            {chart.songs?.map((song) => {
                                return (
                                    <div
                                        className="homecard"
                                        key={song.id}
                                        onClick={() => {
                                            handlePlayTrack(song);
                                        }}
                                    >
                                        <img
                                            src={song?.image[2]?.link}
                                            className="homecard-image"
                                            alt="Playlist-Art"
                                        />
                                        <p className="homecard-title">{song.name}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </>)
                })}

















                {/* OLD CODE */}
                {/* <h2 className='home-title'>All Songs</h2>
                <div className='homecards'>
                    {allSongs?.map((song) => (
                        <div
                            className="homecard"
                            key={song.track_id}
                            onClick={() => {
                                handlePlayTrack(song);
                            }}
                        >
                            <img
                                src={song.track_image}
                                className="homecard-image"
                                alt="Playlist-Art"
                            />
                            <p className="homecard-title">{song.track_name}</p>
                        </div>
                    ))}
                </div> */}
                {/* <Carousel /> */}
                {/* <h2 className='home-title'>Liked Songs</h2>
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
                        </div>
                    ))}
                </div> */}
                {/* <h2 className='home-title'>Top Releases</h2>
                <div className='homecards'>
                    {newReleases?.map((newRelease) => (
                        <div
                            className="homecard"
                            key={newRelease.id}
                            onClick={() => handlePlayTrack(newRelease)}
                        >
                            <img
                                src={newRelease.images[0]?.url}
                                className="homecard-image"
                                alt="Playlist-Art"
                            />
                            <p className="homecard-title">{newRelease.name}</p>
                        </div>
                    ))}
                </div> */}
            </div>
        </div>
    )
}

export default Home