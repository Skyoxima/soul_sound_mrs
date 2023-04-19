import React, { useContext, useEffect } from 'react'
import { currTrackContext } from '../../../App';
import ReactAudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
// import apiClient from '../../../spotify';
import './Player.css';
import './audioPlayer.scss'
import axios from 'axios';
function Player() {

  const { currTrack, setCurrTrack } = useContext(currTrackContext);
  const noSongImage = "https://cdn.pixabay.com/photo/2016/05/24/22/54/icon-1413583_960_720.png";
  // console.log(currTrack);
  useEffect(() => {
    if (currTrack) {
      axios.post("http://localhost:3001/addMusicToListeningHistory", { currTrackId: currTrack?.id, currUserId: localStorage.getItem("currUserId") }).then(data => {
        console.log(data);
      }).catch(err => {
        console.log(err);
      })
    }
    else {
      axios.get("http://localhost:3001/getLastListenedMusic?currUserId=" + localStorage.getItem("currUserId")).then(data => {
        axios.get("https://saavn.me/songs?id=" + data.data.lastListenedMusic).then(data => {
          setCurrTrack(data.data.data[0])
        })
      }).catch(err => {
        console.log(err);
      })
    }
  }, [currTrack])

  return (
    <div className="player-body">
      <div className="songImage">
        <img
          src={currTrack?.image[2]?.link ? (currTrack?.image[2].link) : (noSongImage)}
          alt="song art" />
        <div className="songImage-shadow">
          <img
            src={currTrack?.image[2]?.link ? (currTrack?.image[2].link) : (noSongImage)}
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