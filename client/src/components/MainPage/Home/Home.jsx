import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { currTrackContext } from '../../../App';
import './Home.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import he from 'he';


function Home() {
    const [charts, setCharts] = useState([]);
    const { setCurrTrack } = useContext(currTrackContext);
    const [state, setState] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        const userState = JSON.parse(localStorage.getItem("userData"))
        const userToken = localStorage.getItem("token")
        console.log(userState)
        if (!userToken) {
            navigate("/login")
        } else {
            localStorage.setItem("currUser", userState?.username);
            localStorage.setItem("currUserId", userState?.id);
            setState(userState)
        }
    }, [])

    const settings = {
        infinite: true,
        speed: 5000,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
    };
    useEffect(() => {
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
                            setCharts(prevState => [...prevState, { title: chartTitle, songs: response.data.data.songs.slice(0, 10) }]);
                        })
                    })
                })
        }
        else {
            return;
        }
    }, [])
    const handlePlayTrack = async (currSong) => {
        setCurrTrack(currSong);
        var spotifyData = {}
        await axios.get(`http://localhost:3001/song-audio-features?songName=${currSong.name}`)
            .then(res => {
                spotifyData = res.data;
            })
            .catch(err => {
                console.log(err);
            })
        await axios.post("http://localhost:3001/addMusic", {
            musicData: { ...currSong, ...spotifyData }
        }).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
    }
    return (
        state && (<div className="main-container">
            <div className="home-content">
                <h2>Home</h2>
                {/* OPTIMISED */}
                {charts.map(chart => {
                    return (<>
                        <h2 className='home-title'>{chart.title}</h2>
                        <div className='homecards' key={chart.title}>
                            <Slider {...settings}>
                                {chart.songs?.map((song) => (
                                    <div>
                                        <div
                                            className="homecard"
                                            key={song.id}
                                            onClick={() => handlePlayTrack(song)}
                                        >
                                            <img
                                                src={song?.image[2]?.link}
                                                className="homecard-image"
                                                alt="homecard"
                                            />
                                            <p className="homecard-title">{he.decode(song.name)}</p>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </>)
                })}
            </div>
        </div>)
    )
}

export default Home