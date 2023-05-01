import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { currTrackContext } from '../../../App';
import './Recommends.css';


function Recommends() {
  const [recommendations, setRecommendations] = useState([]);
  const { currTrack, setCurrTrack } = useContext(currTrackContext);

  useEffect(() => {
    axios.get('http://localhost:5000/recommend', { params: { curr_user_id: localStorage.getItem("currUserId"), song_name: currTrack?.name } })
      .then(response => {
        console.log(response.data);
        setRecommendations(response.data);
      })
      .catch(error => {
        console.error(error);
      })
  }, [currTrack])

  const handleClick = async (song) => {
    await axios.get(`https://saavn.me/songs?link=${song.track_url}`).then((res) => {
      setCurrTrack(res.data.data[0]);
    }).catch(err => {
      console.log(err);
    })
  }
  return (
    <div className="recommendations">
      <h2 style={{ textAlign: "left" }}>Recommendations</h2>
      <div className="recommendations-content">
        {recommendations?.map((song) => (
          <div
            className="recommend-card"
            key={song?.id}
            onClick={() => handleClick(song)}
          >
            <img
              src={song?.track_image}
              // src={"https://img.freepik.com/free-icon/user_318-804790.jpg"}
              alt="Playlist-Art"
              width={"100px"}
            />
            <p className="recommend-title">{song?.track_name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Recommends