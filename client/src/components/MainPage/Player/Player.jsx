import React, { useContext, useEffect } from 'react'
import { currTrackContext } from '../../../App';
import ReactAudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
// import apiClient from '../../../spotify';
import './Player.css';
import './audioPlayer.scss'
function Player() {
  useEffect(() => {
    // apiClient.get(`tracks/${currTrack?.id}`).then(res => {
    // }).catch(err => { console.log(err); })
    // axios.get()
  }, [])


  const { currTrack } = useContext(currTrackContext);
  const noSongImage = "https://cdn.pixabay.com/photo/2016/05/24/22/54/icon-1413583_960_720.png";
  return (
    <div className="player-body">
      <div className="songImage">
        <img
          src={currTrack?.image[2].link ? (currTrack?.image[2].link) : (noSongImage)}
          alt="song art" />
        <div className="songImage-shadow">
          <img
            src={currTrack?.image[2].link ? (currTrack?.image[2].link) : (noSongImage)}
            alt="shadow" className="songImage-shadow" />
        </div>
      </div>
      <div className="songInfo-card">
        <div className="songName-container">
          <div className="marquee">
            <p>{currTrack ? (currTrack?.name + " - " + currTrack?.primaryArtists) : ("Click on a Song to play")}</p>
          </div>
        </div>
      </div>
      <div className='custom-player'>
        {/* <div style={{ "width": "100%", "height": "20vh", "display": "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
          <audio id="myAudio" src={`${currTrack?.downloadUrl[4].link}`} type="audio/mp3" controls>
          </audio>
        </div> */}
        <ReactAudioPlayer
          src={`${currTrack?.downloadUrl[4].link}`}
          autoPlay={false}
          controls
          loop={true}
        // onPlay={onPlay}
        // onPause={onPause}
        // onEnded={onEnded}
        />
      </div>

    </div>
  )
}

export default Player