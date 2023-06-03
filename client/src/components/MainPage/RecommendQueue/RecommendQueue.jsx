import React, { useContext, useEffect, useState } from 'react'
import './RecommendQueue.css';
import { currTrackContext, reccTrackContext } from '../../../App';
import axios from 'axios';

function RecommendQueue() {
    const [upNextTracks, setUpNextTracks] = useState([]);
    const { currTrack, setCurrTrack } = useContext(currTrackContext);
    const { reccTrack, setReccTrack } = useContext(reccTrackContext);

    useEffect(() => {
        if (!reccTrack) {
            axios.get('http://localhost:5000/recommend', { params: { curr_user_id: localStorage.getItem("currUserId"), song_name: currTrack?.name } })
                .then(response => {
                    setUpNextTracks(response.data);
                    console.log(response.data);
                })
                .catch(error => {
                    console.error(error);
                })
        }
    }, [currTrack])

    function convertDuration(durationInMs) {
        const minutes = Math.floor(durationInMs / 60000); // 1 minute = 60,000 milliseconds
        const seconds = ((durationInMs % 60000) / 1000).toFixed(0); // The remainder of durationInMs divided by 60,000 is the number of milliseconds that are less than one minute. We then divide this number by 1,000 to get the number of seconds.
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds; // Add leading zero to seconds if needed
    }

    const handleReccClick = (track) => {
        axios.get("https://saavn.me/songs?id=" + track?.track_id).then(data => {
            setCurrTrack(data.data.data[0]);
            setReccTrack(true);
        })
    }
    return (
        <div className="recc-container flex">
            <div className="recc flex">
                <p className="upNext">Up Next</p>
                <div className="recc-list">
                    {upNextTracks?.map((track, index) => (
                        <div
                            key={index + "key"}
                            className="recc-item flex"
                            onClick={() => { handleReccClick(track) }}
                        >
                            <p className="track-name">{track?.track_name}</p>
                            <p>{0 + convertDuration(`${track?.duration_ms}`)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RecommendQueue