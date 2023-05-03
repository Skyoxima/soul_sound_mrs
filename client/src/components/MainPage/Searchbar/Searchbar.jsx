import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import './Searchbar.css';
import ToggleTheme from '../ToggleTheme/ToggleTheme';
import axios from 'axios';
import { currTrackContext } from '../../../App';

function Searchbar() {
    const [searchText, setSearchText] = useState("");
    const [searchMusic, setSearchMusic] = useState(null);
    const { setCurrTrack } = useContext(currTrackContext);

    useEffect(() => {
        // When user finishes typing only then search for it
        const timer = setTimeout(() => {
            if (searchText.length > 0) {
                axios.get(`https://saavn.me/search/songs?query=${searchText.replace(" ", "+")}`)
                    .then(res => { setSearchMusic(res.data.data.results[0]); console.log(res.data.data.results[0]); })
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [searchText])

    const handleSearchInput = (e) => {
        setSearchText(e.target.value);
    }

    return (
        <div className='search-box'>
            <input type="text" placeholder='🔍 Search...' value={searchText} onChange={(e) => { handleSearchInput(e) }} />
            <button onClick={() => { setCurrTrack(searchMusic); setSearchText(""); }}>Submit</button>
            {/* <ToggleTheme /> */}
        </div>
    )
}

export default Searchbar