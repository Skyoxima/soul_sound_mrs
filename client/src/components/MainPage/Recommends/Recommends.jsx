import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { currTrackContext, reccTrackContext } from '../../../App';
import './Recommends.css';
import he from 'he';
import ReactLoading from 'react-loading';

function Recommends() {
  const [recommendations, setRecommendations] = useState([]);
  const { currTrack, setCurrTrack } = useContext(currTrackContext);
  const { reccTrack, setReccTrack } = useContext(reccTrackContext);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!reccTrack) {
      setIsLoading(true);
      var songName = null;
      if (currTrack) {
        songName = he.decode(currTrack?.name);
      }
      axios.get('http://localhost:5000/recommend', { params: { curr_user_id: localStorage.getItem("currUserId"), song_name: songName } })
        .then(response => {
          setRecommendations(response.data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error(error);
        })
    }
  }, [currTrack])

  const handleClick = async (song) => {
    await axios.get(`https://saavn.me/songs?link=${song.track_url}`).then((res) => {
      setCurrTrack(res.data.data[0]);
      setReccTrack(true);
    }).catch(err => {
      console.log(err);
    })
  }

  return (
    <div className="main-container">
      <div className="recommendations">
        <h2 style={{ textAlign: "left" }}>Recommendations</h2>
        {isLoading ?
          (<ReactLoading type={"spokes"} color={"yellow"} width={"10%"} height={'50%'} />) : (
            <div className="recommendations-content">
              {recommendations?.map((song) => (
                <div
                  className="recommend-card"
                  key={song?.track_id}
                  onClick={() => handleClick(song)}
                >
                  <img
                    src={song?.track_image}
                    alt="Playlist-Art"
                    width={"100px"}
                  />
                  <p className="recommend-title">{song?.track_name}</p>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}

export default Recommends