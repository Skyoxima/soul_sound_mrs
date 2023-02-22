import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import apiClient from '../../../spotify';
import './Player.css';

function Player() {
  const location = useLocation();
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState({});
  const [currIdx, setCurrIdx] = useState(0);
  const [trackId, setTrackId] = useState();
  const [songImage, setSongImage] = useState();
  useEffect(() => {
    apiClient.get("tracks/0nrRP2bk19rLc0orkWPQk2?si=be4ec7e03f4642a2").then(res => {
      // console.log(res.data.album);
      setSongImage(res.data.album.images[0].url)
      setTrackId(res.data.uri.split(":")[2]);
    }).catch(err => { console.log(err); })
  }, [])

  return (
    <div className="player-body">
      {/* <AlbumImg url={album?.images[0]?.url} /> */}
      {/* <AlbumInfo album={album} /> */}
      <div className="songImage">
        <img
          src={songImage}
          alt="song art" />
        <div className="songImage-shadow">
          <img
            // src={url} 
            src={songImage}
            alt="shadow" className="songImage-shadow" />
        </div>
      </div>
      <div className="songInfo-card">
        <div className="songName-container">
          <div className="marquee">
            {/* <p>{album?.name + " - " + artists?.join(", ")}</p> */}
          </div>
        </div>
        <div className="song-info">
          {/* <p>Album: <span>{`${album?.name}`}</span></p> */}
          {/* <p>Type: <span>{`${album?.album_type}`}</span></p> */}
          {/* <p>Artist: <span>{`${artists?.join(", ")}`}</span></p> */}
          {/* <p>Total Tracks: <span>{`${album?.total_tracks} track(s)`}</span></p> */}
        </div>
        <div className="song-release">
          {/* <p>Release Date: {album?.release_date}</p> */}
        </div>
      </div>
      <div style={{ width: "90%", margin: "0 auto" }}>
        <iframe style={{ borderRadius: 0, margin: "15px 0", border: "1px solid black" }} src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
          width="100%" height={80} allowfullscreen={true} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
      </div>
    </div>
  )
}

export default Player