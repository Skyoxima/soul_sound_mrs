import React from 'react'
// import apiClient from '../../../spotify';
import './Player.css';

function Player({ currTrack }) {
  // useEffect(() => {
  // apiClient.get(`tracks/${currTrack?.id}`).then(res => {
  // }).catch(err => { console.log(err); })
  // }, [])
  const noSongImage = "https://cdn.pixabay.com/photo/2016/05/24/22/54/icon-1413583_960_720.png";
  return (
    <div className="player-body">
      <div className="songImage">
        <img
          src={currTrack?.album?.images[0].url ? (currTrack?.album?.images[0].url) : (noSongImage)}
          alt="song art" />
        <div className="songImage-shadow">
          <img
            src={currTrack?.album?.images[0].url ? (currTrack?.album?.images[0].url) : (noSongImage)}
            alt="shadow" className="songImage-shadow" />
        </div>
      </div>
      <div className="songInfo-card">
        <div className="songName-container">
          <div className="marquee">
            <p>{currTrack?.name + " - " + currTrack?.artists?.map(artist => { return artist.name }).join(", ")}</p>
          </div>
        </div>
      </div>
      <div style={{ width: "90%", margin: "0 auto" }}>
        {currTrack.id ? (<iframe style={{ borderRadius: 0, margin: "15px 0", border: "1px solid black" }} src={`https://open.spotify.com/embed/track/${currTrack?.id}?utm_source=generator`}
          width="100%" height={80} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title='player'></iframe>) :
          (<p className='iframe-alt'>Click a song to play</p>)}
      </div>
    </div>
  )
}

export default Player