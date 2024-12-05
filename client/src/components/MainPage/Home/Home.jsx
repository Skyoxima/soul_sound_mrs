import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { currTrackContext, reccTrackContext } from '../../../App';
import './Home.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import he from 'he';


function Home() {
    const [charts, setCharts] = useState([]);
    const { setCurrTrack } = useContext(currTrackContext);
    const { setReccTrack } = useContext(reccTrackContext);
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
            axios.get("https://saavn.dev/api/search/playlists?query=Indie")
                .then(res => {
                    return res.data.data.results.slice(0, 5);
                })
                .then(res => {
                    res.forEach(ele => {
                        console.log(ele)
                        const chartId = ele.id;
                        const chartTitle = ele.name;
                        axios.get(`https://saavn.dev/api/search/playlists/${chartId}`).then(response => {
                            console.log(response.data)
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
        setReccTrack(false);
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
                        <h2 className='home-title' key={chart.title}>{chart.title}</h2>
                        <div className='homecards'>
                            <Slider {...settings}>
                                {chart.songs?.map((song) => (
                                    <div key={song.id}>
                                        <div
                                            className="homecard"
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