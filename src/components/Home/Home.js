import React from 'react'
import { useState } from 'react'
import Videos from '../Videos/Videos'

function Home() {

    const [search, setSearch] = useState('')
    const [videos, setVideos] = useState({})

    async function handleSubmit(e) {
        e.preventDefault()
        if (search === '') return
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search.trim()}&key=${process.env.REACT_APP_API_KEY}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch videos');
            }

            const data = await response.json();
            if (data.items.length === 0) setVideos({})
            else setVideos({ response: data.items });
        } catch (error) {
            console.error('Error searching videos:', error);
            setVideos({})
        }
        setSearch('')
    }
    return (
        <>
            <div className="container mt-4">
                <form onSubmit={handleSubmit}>
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" id='searchbar' value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search videos" />
                        <button className="btn btn-primary" type="submit">Search</button>
                    </div>
                </form>
            </div>
            <Videos videos={videos} />
        </>
    )
}

export default Home