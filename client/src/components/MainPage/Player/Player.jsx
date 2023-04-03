import axios from 'axios';
import React, { useEffect } from 'react'
// import apiClient from '../../../spotify';
import './Player.css';

function Player({ currTrack }) {
  useEffect(() => {
    // apiClient.get(`tracks/${currTrack?.id}`).then(res => {
    // }).catch(err => { console.log(err); })
    // axios.get()
  }, [])
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
            <p>{currTrack?.name + " - " + currTrack?.primaryArtists}</p>
          </div>
        </div>
      </div>
      {/* <div style={{ width: "90%", margin: "0 auto" }}>
        {currTrack.id ? (<iframe style={{ borderRadius: 0, margin: "15px 0", border: "1px solid black" }} src={`https://open.spotify.com/embed/track/${currTrack?.id}?utm_source=generator`}
          width="100%" height={80} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title='player'></iframe>) :
          (<p className='iframe-alt'>Click a song to play</p>)}
      </div> */}
      <div style={{ margin: "0 auto" }}>
        {/* <audio src={`${currTrack?.downloadUrl[0].link}`}></audio> */}
        <div style={{ "width": "100%", "height": "20vh", "display": "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
          <audio id="myAudio" src={`${currTrack?.downloadUrl[4].link}`} type="audio/mp3" controls>
          </audio>
        </div>
      </div>
    </div>
  )
}

export default Player