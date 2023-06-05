import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import './Searchbar.css';
import axios from 'axios';
import { currTrackContext } from '../../../App';
import he from 'he';


function Searchbar() {
    const [searchText, setSearchText] = useState("");
    const [searchMusic, setSearchMusic] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const { setCurrTrack } = useContext(currTrackContext);

    useEffect(() => {
        // When user finishes typing only then search for it
        if (searchText.length > 0) {
            const timer = setTimeout(() => {
                axios.get(`https://saavn.me/search/songs?query=${searchText.replace(" ", "+")}`)
                    .then(res => { setSearchResults(res.data.data.results);})
            }, 1000);
            return () => clearTimeout(timer);
        }
        else{
            setSearchResults([]);
        }
    }, [searchText])

    return (
        <div className='search-box'>
            <input type="text" placeholder='🔍 Search...' value={searchText} onChange={(e) => { setSearchText(e.target.value); }} />
            {searchResults.length > 0 && (
                <div className='search-results'>
                    {searchResults.map((item, idx) => {
                        return (<div className='search-result' key={idx} onClick={() => { setCurrTrack(item); setSearchText(""); }}>
                            <img src={item.image[2].link} alt="song-img" width={50} />
                            <p>{he.decode(item.name)} | {he.decode(item.primaryArtists)} | {he.decode(item.year)}</p>
                        </div>)
                    })}
                </div>
            )}
            {/* <button onClick={() => { setCurrTrack(searchMusic); setSearchText(""); }}>Submit</button> */}
            {/* <ToggleTheme /> */}
        </div>
    )
}

export default Searchbar