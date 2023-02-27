import React from 'react'
import './Recommend.css';

function Recommend() {
    return (
        <div className="recc-container flex">
            <div className="recc flex">
                <p className="upNext">Up Next</p>
                <div className="recc-list">
                    {/* {tracks?.map((track, index) => (
                        <div
                            key={index + "key"}
                            className="queue-item flex"
                            onClick={() => { setCurrIdx(index) }}
                        >
                            <p className="track-name">{track?.track?.name}</p>
                            <p>{`0${Math.floor((track?.track?.duration_ms) / (1000 * 60) % 60)}:${Math.floor(((track?.track?.duration_ms)) % 60)}`}</p>
                        </div>
                    ))} */}
                </div>
            </div>
        </div>
    )
}

export default Recommend